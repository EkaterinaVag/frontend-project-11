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
    errors: '',
    isValid: false,
    urlUniqueLinks: [],
    posts: [],
    feeds: [],
    uiState: {
      touchedPosts: [],
    },
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
    const allOriginsProxyUrl = 'https://allorigins.hexlet.app/get?url=';
    const url = new URL(`${allOriginsProxyUrl}${value}`);

    validate(value, watchedState.urlUniqueLinks)
      .then(() => axios.get(url))
      .then((response) => {
        const responseData = response.data.contents;
        const { feeds, posts } = parseData(responseData);
        const feedsWithId = feeds.map((feed) => ({ ...feed, id: uniqueId() }));
        const postsWithId = posts.map((post) => ({ ...post, id: uniqueId() }));
        watchedState.feeds = feedsWithId;
        watchedState.posts = postsWithId;
        console.log(watchedState.posts);
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
  //     const postPromises = watchedState.urlUniqueLinks.map((url) => axios.get(`https://allorigins.hexlet.app/get?url=${url}`)
  //       .then((response) => {
  //         const responseData = response.data.contents;
  //         const { posts } = parseData(responseData);

  //         posts.forEach((post) => {
  //           const isDuplicate = watchedState.posts
  //             .some((loadedPost) => loadedPost.title === post.title);
  //           if (!isDuplicate) {
  //             watchedState.posts.push({ ...post, id: uniqueId() });
  //             console.log(watchedState.posts);
  //           }
  //         });
  //       })
  //       .catch(() => {
  //         watchedState.errors = 'feedBackTexts.networkError';
  //       }));

  //     Promise.all(postPromises).finally(() => {
  //       setTimeout(checkAndUpdatePosts, 5000);
  //     });
  //   }
  // };

  // checkAndUpdatePosts();

  // const postsElement = document.querySelectorAll('.posts');
  // postsElement.addEventListener('click', (e) => {
  //   if (e.target.tagName === 'A') {
  //     const post = e.target;
  //     watchedState.uiState.touchedPosts.push(post);
  //   }
  // });
};
