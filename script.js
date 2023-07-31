let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("alarm-clock.mp3"); // Replace "./alarm.mp3" with the correct path to your sound file
let alarmIndex = 0;

// Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Display Time
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];
  // Display time
  timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;
  // Alarm
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}

// Input validation
const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

// Create alarm div
const createAlarm = (alarmObj) => {
  // Keys from object
  const { id, alarmHour, alarmMinute } = alarmObj;
  // Alarm div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}</span>`;
  // Checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  // Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};

// Save alarms to localStorage
const saveAlarmsToLocalStorage = () => {
  localStorage.setItem("alarms", JSON.stringify(alarmsArray));
};

// Load alarms from localStorage
const loadAlarmsFromLocalStorage = () => {
  const savedAlarms = localStorage.getItem("alarms");
  if (savedAlarms) {
    alarmsArray = JSON.parse(savedAlarms);
    alarmsArray.forEach((alarm) => createAlarm(alarm));
  }
};

// Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;
  // Alarm object
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.isActive = false;
  console.log(alarmObj);
  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  saveAlarmsToLocalStorage(); // Save alarms to localStorage
  hourInput.value = appendZero(0);
  minuteInput.value = appendZero(0);
});

// Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
    saveAlarmsToLocalStorage(); // Save alarms to localStorage
  }
};

// Stop Alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
    saveAlarmsToLocalStorage(); // Save alarms to localStorage
  }
};

// Delete Alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    if (alarmsArray[index].isActive) {
      alarmSound.pause(); // Stop the sound if an active alarm is deleted
    }
    alarmsArray.splice(index, 1);
    saveAlarmsToLocalStorage(); // Save alarms to localStorage
  }
};

window.onload = () => {
  setInterval(displayTimer, 1000);
  loadAlarmsFromLocalStorage(); // Load alarms from localStorage
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = alarmsArray.length; // Update alarmIndex based on the loaded alarms
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
};

alarmSound.loop = false;

hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);

  // Limitar o valor do input a 59
  const minuteValue = parseInt(minuteInput.value);
  if (minuteValue > 59) {
    minuteInput.value = "59";
  }
});

// Adicionamos um evento de escuta no input para horas
hourInput.addEventListener("input", () => {
  const value = hourInput.value;
  // Limitar o valor do input a dois caracteres
  if (value.length > 2) {
    hourInput.value = value.slice(0, 2);
  }
});

// Adicionamos um evento de escuta no input para minutos
minuteInput.addEventListener("input", () => {
  const value = minuteInput.value;
  // Limitar o valor do input a dois caracteres
  if (value.length > 2) {
    minuteInput.value = value.slice(0, 2);
  }
});