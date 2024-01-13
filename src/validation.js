import onChange from 'on-change';
import * as yup from 'yup';

const schema = yup.object().shape({
  url: yup.string().url().required(),
});

const validate = async (url, urlUniqueLinks) => new Promise((resolve, reject) => {
  schema.validate({ url })
    .then(() => {
      if (urlUniqueLinks.includes(url)) {
        reject(new Error('RSS уже существует'));
      } else {
        resolve('');
      }
    })
    .catch(() => reject(new Error('Ссылка должна быть валидным URL')));
});

export default () => {
  const state = {
    url: '',
    error: '',
    isValid: false,
    urlUniqueLinks: [],
  };

  const input = document.querySelector('input');
  const watchedState = onChange(state, () => {
    if (!watchedState.error) {
      input.classList.remove('is-invalid');
      const feedbackElement = document.querySelector('.feedback');
      feedbackElement.textContent = watchedState.error.message;
    }
    if (watchedState.error) {
      input.classList.add('is-invalid');
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = input;
    watchedState.url = value;
    const validateAnswer = validate(watchedState.url, watchedState.urlUniqueLinks);
    watchedState.error = validateAnswer;

    if (!watchedState.error) {
      watchedState.isValid = true;
      watchedState.urlUniqueLinks.push(value);
      input.value = '';
      input.focus();
    }
  });
};
