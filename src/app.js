import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import resources from './locales/index.js';
import watch from './view.js';
import parseData from './parser.js';

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
    networkErrors: { message: '' },
    isValid: false,
    urlUniqueLinks: [],
    posts: [],
    feeds: [],
  };

  const watchedState = watch(i18n, state);

  const schema = yup.object().shape({
    url: yup.string()
      .url(i18n.t('feedBackTexts.invalidURLError'))
      .required(),
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
    const url = `https://allorigins.hexlet.app/get?url=${watchedState.url}`;

    validate(watchedState.url, watchedState.urlUniqueLinks)
      .then(() => axios.get(url))
      .then((response) => {
        const responseData = response.data.contents;
        const { feeds, posts } = parseData(responseData, i18n);
        watchedState.feeds.push(feeds);
        watchedState.posts.push(posts);
        watchedState.isValid = true;
        watchedState.urlUniqueLinks.push(value);
        watchedState.errors.message = '';
        watchedState.networkErrors.message = '';
      })
      .catch((error) => {
        watchedState.isValid = false;
        if (error.message === 'Network Error') {
          watchedState.networkErrors.message = i18n.t('feedBackTexts.networkError');
        } else {
          watchedState.errors.message = error.message;
        }
      });
  });
};
