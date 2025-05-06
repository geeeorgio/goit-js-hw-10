import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userDate = selectedDates[0];
    dealWithTimer();
  },
};
flatpickr('#datetime-picker', options);

const refs = {
  dateInputEl: document.getElementById('datetime-picker'),
  startBtn: document.querySelector('.js-flatpickr button'),
  timerEl: document.querySelector('.timer'),
};

refs.startBtn.addEventListener('click', handleStartBtnClick);

function isFutureDate(date) {
  return date instanceof Date && date.getTime() > Date.now();
}

function enableTimer() {
  refs.startBtn.classList.add('active');
}

function disableTimer() {
  refs.startBtn.classList.remove('active');
}

function showMessage() {
  iziToast.error({
    title: 'Error',
    message: 'Please choose a date in the future',
    position: 'topRight',
  });
}

function dealWithTimer() {
  if (isFutureDate(userDate)) {
    enableTimer();
  } else {
    disableTimer();
    showMessage();
  }
}

function blockCalendar() {
  refs.dateInputEl.disabled = true;
}

function enableCalendar() {
  refs.dateInputEl.disabled = false;
}

function handleStartBtnClick(event) {
  blockCalendar();
}

console.log(refs.timerEl.children);
const TIMER = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null,
};

const childs = refs.timerEl.children;
for (const child of childs) {
  console.log(child.children);
  const [value, label] = child.children;
  console.log(value, label);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
