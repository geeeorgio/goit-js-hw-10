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
  timerEl: document.querySelector('.timer'),
  startBtn: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

refs.startBtn.addEventListener('click', onStartBtnClick);

function isFutureDate(date) {
  return date instanceof Date && date.getTime() > Date.now();
}

function timeDiff(date) {
  return date.getTime() - Date.now();
}

function enableTimer() {
  refs.startBtn.classList.add('active');
  refs.startBtn.disabled = false;
}

function disableTimer() {
  refs.startBtn.classList.remove('active');
  refs.startBtn.disabled = true;
}

function showErrorMessage() {
  iziToast.error({
    title: 'Error',
    message: 'Please choose a date in the future',
    position: 'topRight',
  });
}

function showSuccesMessage() {
  iziToast.success({
    title: 'Done!',
    message: 'Time is up! Now click Start button.',
    position: 'topRight',
  });
}

function dealWithTimer() {
  if (isFutureDate(userDate)) {
    enableTimer();
    showSuccesMessage();
  } else {
    disableTimer();
    showErrorMessage();
  }
}

function blockCalendar() {
  refs.dateInputEl.disabled = true;
}

function enableCalendar() {
  refs.dateInputEl.disabled = false;
}

function doubleNumToString(number) {
  return String(number).padStart(2, '0');
}

function onStartBtnClick() {
  TIMER.run();
}

const TIMER = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null,
  intervalId: null,

  run() {
    blockCalendar();
    disableTimer();

    this.update();

    this.intervalId = setInterval(() => {
      if (timeDiff(userDate) <= 0) {
        clearInterval(this.intervalId);
        this.reset();
        enableCalendar();
        return;
      }

      this.update();
    }, 1000);
  },

  update() {
    const { days, hours, minutes, seconds } = convertMs(timeDiff(userDate));

    this.days = doubleNumToString(days);
    this.hours = doubleNumToString(hours);
    this.minutes = doubleNumToString(minutes);
    this.seconds = doubleNumToString(seconds);

    this.render();
  },

  render() {
    const { daysEl, hoursEl, minutesEl, secondsEl } = refs;

    daysEl.textContent = this.days;
    hoursEl.textContent = this.hours;
    minutesEl.textContent = this.minutes;
    secondsEl.textContent = this.seconds;
  },

  reset() {
    this.days = null;
    this.hours = null;
    this.minutes = null;
    this.seconds = null;
    this.intervalId = null;
  },
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
