import onChange from 'on-change';
import createTitle from './utils/createTitle.js';

export default (i18n, state) => {
  const renderFormTexts = () => {
    const staticTextElements = {
      rssAggregatorTitle: document.querySelector('h1.display-3'),
      rssAggregatorDescription: document.querySelector('p.lead'),
      rssFormPlaceholder: document.querySelector('label[for="url-input"]'),
      rssFormButton: document.querySelector('button[aria-label="add"]'),
      rssFormExample: document.querySelector('p.mt-2.mb-0.text-secondary'),
    };

    const arrayOfElements = Object.entries(staticTextElements);
    arrayOfElements.forEach(([key, value]) => {
      const element = value;
      element.textContent = i18n.t(`interfaceTexts.${key}`);
    });
  };

  const renderErrors = (watchedState) => {
    const input = document.querySelector('input');
    input.classList.remove('is-invalid');

    const feedbackElement = document.querySelector('.feedback');
    feedbackElement.classList.remove('text-danger', 'text-success');

    if (watchedState.isValid) {
      feedbackElement.textContent = i18n.t('feedBackTexts.correctURL');
      feedbackElement.classList.add('text-success');
      input.value = '';
      input.focus();
    } else {
      feedbackElement.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedbackElement.textContent = i18n.t(watchedState.errors);
    }
  };

  const renderPosts = (watchedState) => {
    const postContainer = document.querySelector('.posts');
    createTitle(postContainer, i18n.t('posts'));

    watchedState.posts.forEach(({
      title, link, id,
    }) => {
      const generalDiv = document.createElement('div');
      generalDiv.classList.add('row', 'my-3', 'align-items-center');

      const divForPost = document.createElement('div');
      divForPost.classList.add('fs-6', 'col-8');

      const post = document.createElement('a');
      post.textContent = title;
      post.setAttribute('href', link);
      post.setAttribute('id', id);
      post.setAttribute('target', '_blank');
      post.classList.add('fw-bold');
      divForPost.append(post);

      const divForButton = document.createElement('div');
      divForButton.setAttribute('class', 'd-grid gap-2 d-md-flex justify-content-md-end col-3');

      const previewButton = document.createElement('button');
      previewButton.setAttribute('type', 'button');
      previewButton.setAttribute('class', 'btn btn-outline-primary btn-sm');
      previewButton.dataset.bsToggle = 'modal';
      previewButton.dataset.bsTarget = '#modal';
      previewButton.dataset.postId = id;
      previewButton.textContent = i18n.t('interfaceTexts.previewButton');
      divForButton.append(previewButton);

      generalDiv.append(divForPost, divForButton);
      postContainer.append(generalDiv);
    });
  };

  const renderModal = (watchedState) => {

    const id = watchedState.uiState.activePostId;
    const activePost = document.getElementById(id);

    const title = activePost.textContent;
    const link = activePost.href;

    // const activePost = watchedState.posts
    //   .find((post) => post.id === watchedState.uiState.activePostId);

    // const { title, link, description } = activePost;

    const divModal = document.querySelector('.modal');

    const modalTitle = divModal.querySelector('.modal-title');
    modalTitle.textContent = title;

    // const modalBody = divModal.querySelector('.modal-body');
    // modalBody.textContent = description;

    const closeContentButton = divModal.querySelector('.btn-secondary');
    closeContentButton.textContent = i18n.t('interfaceTexts.closeButton');

    const readMoreButton = divModal.querySelector('.full-article');
    readMoreButton.textContent = i18n.t('interfaceTexts.readButton');
    readMoreButton.href = link;
  };

  const renderFeeds = (watchedState) => {
    const feedContainer = document.querySelector('.feeds');
    createTitle(feedContainer, i18n.t('feeds'));

    watchedState.feeds.forEach(({ title, description }) => {
      const divForFeed = document.createElement('div');
      const feedTitle = document.createElement('h6');
      feedTitle.textContent = title;
      const feedDescription = document.createElement('p');
      feedDescription.classList.add('text-secondary');
      feedDescription.textContent = description;
      divForFeed.append(feedTitle, feedDescription);
      feedContainer.append(divForFeed);
    });
  };

  const renderTouchedPosts = (watchedState) => {
    watchedState.uiState.touchedPosts.forEach((postId) => {
      const post = document.getElementById(postId);

      if (!post.classList.contains('fw-normal')) {
        post.classList.remove('fw-bold');
        post.classList.add('fw-normal', 'link-secondary');
      }
    });
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'errors':
        renderErrors(watchedState);
        break;
      case 'isValid':
        renderErrors(watchedState);
        break;
      case 'posts':
        renderPosts(watchedState);
        break;
      case 'feeds':
        renderFeeds(watchedState);
        break;
      case 'uiState.touchedPosts':
        renderTouchedPosts(watchedState);
        break;
      case 'uiState.activePostId':
        renderModal(watchedState);
        break;
      case 'urlUniqueLinks':
        break;
      default:
        throw new Error(`Unknown path: ${path}!`);
    }
  });

  renderFormTexts();
  return watchedState;
};
