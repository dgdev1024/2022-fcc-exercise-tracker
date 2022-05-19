const createUserForm = document.querySelector(".create-user-form");
const createUserInput = document.getElementById("username-input");
const createUserData = document.querySelector(".create-user-data");

const getUsersButton = document.querySelector(".get-users-button");
const getUsersData = document.querySelector(".get-users-data");

const addExerciseForm = document.querySelector(".add-exercise-form");
const addExerciseIdInput = document.getElementById("add-exercise-id-input");
const addExerciseDescriptionInput = document.getElementById(
  "add-exercise-description-input"
);
const addExerciseDurationInput = document.getElementById(
  "add-exercise-duration-input"
);
const addExerciseDateInput = document.getElementById("add-exercise-date-input");
const addExerciseData = document.querySelector(".add-exercise-data");

const getUserLogForm = document.querySelector(".get-user-log-form");
const getUserLogIdInput = document.getElementById("get-user-log-id-input");
const getUserLogFromInput = document.getElementById("get-user-log-from");
const getUserLogToInput = document.getElementById("get-user-log-to");
const getUserLogLimitInput = document.getElementById("get-user-log-limit");
const getUserLogData = document.querySelector(".get-user-log-data");

const onCreateUserSubmit = async (ev) => {
  ev.preventDefault();

  createUserData.innerHTML = `<p><em><small>Loading...</small></em></p>`;

  const result = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: createUserInput.value }),
  });
  const data = await result.json();

  if (data.error) {
    createUserData.innerHTML = `<p><em><small>${data.error}</small></em></p>`;
  } else {
    createUserData.innerHTML = `<code><pre>${JSON.stringify(
      data,
      null,
      2
    )}</pre></code>`;
  }
};

const onGetUsersClicked = async () => {
  getUsersData.innerHTML = `<p><em><small>Loading...</small></em></p>`;

  const result = await fetch("/api/users");
  const data = await result.json();

  if (data.error) {
    getUsersData.innerHTML = `<p><em><small>${data.error}</small></em></p>`;
  } else {
    getUsersData.innerHTML = `<code><pre>${JSON.stringify(
      data,
      null,
      2
    )}</pre></code>`;
  }
};

const onAddExerciseSubmit = async (ev) => {
  ev.preventDefault();

  addExerciseData.innerHTML = `<p><em><small>Loading...</small></em></p>`;

  const result = await fetch(
    `/api/users/${addExerciseIdInput.value}/exercises`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: addExerciseDescriptionInput.value,
        duration: addExerciseDurationInput.value,
        date: addExerciseDateInput.value,
      }),
    }
  );
  const data = await result.json();

  if (data.error) {
    addExerciseData.innerHTML = `<p><em><small>${data.error}</small></em></p>`;
  } else {
    addExerciseData.innerHTML = `<code><pre>${JSON.stringify(
      data,
      null,
      2
    )}</pre></code>`;
  }
};

const onGetUserLogSubmit = async (ev) => {
  ev.preventDefault();

  getUserLogData.innerHTML = `<p><em><small>Loading...</small></em></p>`;

  const queryParams = new URLSearchParams({
    from: getUserLogFromInput.value,
    to: getUserLogToInput.value,
    limit: getUserLogLimitInput.value,
  });

  const result = await fetch(
    `/api/users/${getUserLogIdInput.value}/logs?${queryParams}`
  );
  const data = await result.json();

  if (data.error) {
    getUserLogData.innerHTML = `<p><em><small>${data.error}</small></em></p>`;
  } else {
    getUserLogData.innerHTML = `<code><pre>${JSON.stringify(
      data,
      null,
      2
    )}</pre></code>`;
  }
};

createUserForm.addEventListener("submit", onCreateUserSubmit);
getUsersButton.addEventListener("click", onGetUsersClicked);
addExerciseForm.addEventListener("submit", onAddExerciseSubmit);
getUserLogForm.addEventListener("submit", onGetUserLogSubmit);
