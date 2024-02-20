import axios from 'axios';
import { uniqueId } from 'lodash';
import createURL from './createURL.js';
import parseData from './parser.js';

const checkAndUpdatePosts = (watchedState) => {
  if (watchedState.urlUniqueLinks && watchedState.posts) {
    const postPromises = watchedState.urlUniqueLinks.map((link) => 
      axios.get(createURL(link))
        .then((response) => {
          const responseData = response.data.contents;
          const { posts } = parseData(responseData);
          
          posts.forEach((post) => {
            const isDuplicate = watchedState.posts
              .some((loadedPost) => loadedPost.title === post.title);
            if (!isDuplicate) {
              const updatedPosts = [...watchedState.posts, { ...post, id: uniqueId() }];
              watchedState = { ...watchedState, posts: updatedPosts };
            }
          });
        })
        .catch((error) => {
          throw error;
        }));

    Promise.all(postPromises)
      .finally(() => {
        setTimeout(() => checkAndUpdatePosts(watchedState), 5000);
      });
  }
};


export default checkAndUpdatePosts;
