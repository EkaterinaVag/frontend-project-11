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

  yup.setLocale({
    mixed: {
      url: () => ({ key: 'feedBackTexts.invalidURLError' }),
      notOneOf: () => ({ key: 'feedBackTexts.rssExistsError' }),
    },
  });

  const validate = (url, urlUniqueLinks) => {
    const schema = yup.object().shape({
      url: yup.string()
        .url('feedBackTexts.invalidURLError')
        .notOneOf(urlUniqueLinks, 'feedBackTexts.rssExistsError')
        .required(),
    });
    return schema.validate({ url });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { value } = input;
    watchedState.url = value;
    const allOriginsProxyUrl = 'https://allorigins.hexlet.app/get?url=';
    const url = `${allOriginsProxyUrl}${watchedState.url}`;

    validate(watchedState.url, watchedState.urlUniqueLinks)
      .then(() => axios.get(url))
      .then((response) => {
        // if (response.statusText !== 'OK') {
        //   throw new Error('feedBackTexts.networkError');
        // }
        if (response.status < 200 && response.status > 300) {
          throw new Error('feedBackTexts.networkError');
        }
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
        if (error.response) {
          watchedState.networkErrors.message = 'errrrror!';
        }
        watchedState.errors.message = error.message;
      });
  });
};
