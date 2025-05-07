import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let del = null;
let res = '';

function createPromise(delay, value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      value ? resolve(value) : reject(value);
    }, delay);
  });
}

const form = document.querySelector('form');
form.addEventListener('submit', onFormSubmit);
form.addEventListener('input', handleFormInput);

function showErrorMsg(delay) {
  iziToast.error({
    title: 'Error!',
    message: `❌ Rejected promise in ${delay}ms`,
    position: 'topRight',
  });
}

function showSuccessMsg(delay) {
  iziToast.success({
    title: 'Great!',
    message: `✅ Fulfilled promise in ${delay}ms`,
    position: 'topRight',
  });
}

function showWarningMsg() {
  iziToast.warning({
    title: 'Warning',
    message: 'Please fill all fields',
    position: 'topRight',
  });
}

function isFulfilled(question) {
  return question === 'fulfilled';
}

function handleFormInput(event) {
  const { value, type } = event.target;

  if (type === 'number') {
    del = Number(value);
  }
  if (type === 'radio') {
    res = isFulfilled(value);
  }
}

function onFormSubmit(event) {
  event.preventDefault();

  if (!del || res === '') {
    showWarningMsg();
    return;
  }

  createPromise(del, res)
    .then(() => {
      showSuccessMsg(del);
    })
    .catch(() => {
      showErrorMsg(del);
    });

  form.reset();
}
