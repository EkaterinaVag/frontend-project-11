import i18next from 'i18next';
import * as yup from 'yup';
import resources from './locales/index.js';
import watch from './view.js';

export default async () => {
  const form = document.querySelector('form');
  const input = form.querySelector('input');

  const defaultLang = 'ru';

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  const state = {
    url: '',
    errors: { message: '' },
    isValid: false,
    urlUniqueLinks: [],
  };

  const watchedState = watch(i18n, state);

  const schema = yup.object().shape({
    url: yup.string().url(i18n.t('feedBackTexts.invalidURLError')).required(),
  });

  const validate = (url, urlUniqueLinks) => schema.validate({ url })
    .then(() => {
      if (urlUniqueLinks.includes(url)) {
        throw new Error(i18n.t('feedBackTexts.rssExistsError'));
      } else {
        return '';
      }
    });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { value } = input;
    watchedState.url = value;
    try {
      await validate(watchedState.url, watchedState.urlUniqueLinks);
      watchedState.isValid = true;
      watchedState.urlUniqueLinks.push(value);
      watchedState.errors.message = '';
    } catch (error) {
      watchedState.isValid = false;
      watchedState.errors.message = error.message;
    }
  });
};
