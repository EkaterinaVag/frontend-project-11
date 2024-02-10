import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import { uniqueId } from 'lodash';
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
    errors: '',
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
        const responseData = response.data.contents;
        const { feeds, posts } = parseData(responseData);
        console.log(posts);
        const feedsWithId = feeds.map((feed) => ({ ...feed, id: uniqueId() }));
        const postsWithId = posts.map((post) => ({ ...post, id: uniqueId() }));
        watchedState.feeds = feedsWithId;
        watchedState.posts = postsWithId;
        watchedState.isValid = true;
        watchedState.urlUniqueLinks.push(value);
        watchedState.errors = '';
      })
      .catch((error) => {
        watchedState.isValid = false;
        switch (error.name) {
          case 'AxiosError':
            watchedState.errors = 'feedBackTexts.networkError';
            break;
          case 'ParserError':
            watchedState.errors = 'feedBackTexts.invalidRSSResource';
            break;
          default:
            watchedState.errors = error.message;
            break;
        }
      });
  });

  // const checkAndUpdatePosts = () => {
  //   if (watchedState.urlUniqueLinks) {
  //     watchedState.urlUniqueLinks.forEach(async (url) => {
  //       const response = await axios.get(url);
  //       const responseData = response.data.contents;
  //       const { posts } = parseData(responseData);
  //       const newPosts = [];
  //       posts.forEach((post) => {
  //         if (!watchedState.posts.includes(post)) {
  //           newPosts.push({ ...post, id: uniqueId() });
  //         }
  //       });
  //       watchedState.posts.push(...newPosts);
  //     });
  //   }
  // };

  // setTimeout(checkAndUpdatePosts, 5000);
};
