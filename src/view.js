import onChange from 'on-change';

export default (i18n, state) => {
  const renderFormTexts = () => {
    const readMore = document.querySelector('.full-article');
    readMore.textContent = i18n.t('interfaceTexts.readMore');
    const closeModal = document.querySelector('button[data-bs-dismiss="modal"]');
    closeModal.textContent = i18n.t('interfaceTexts.closeModal');
    const rssAggregatorTitle = document.querySelector('h1.display-3');
    rssAggregatorTitle.textContent = i18n.t('interfaceTexts.rssAggregatorTitle');
    const rssAggregatorDescription = document.querySelector('p.lead');
    rssAggregatorDescription.textContent = i18n.t('interfaceTexts.rssAggregatorDescription');
    const rssFormPlaceholder = document.querySelector('label[for="url-input"]');
    rssFormPlaceholder.textContent = i18n.t('interfaceTexts.rssFormPlaceholder');
    const rssFormButton = document.querySelector('button[aria-label="add"]');
    rssFormButton.textContent = i18n.t('interfaceTexts.rssFormButton');
    const rssFormExample = document.querySelector('p.mt-2.mb-0.text-secondary');
    rssFormExample.textContent = i18n.t('interfaceTexts.rssFormExample');
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
      feedbackElement.textContent = watchedState.errors.message;
      feedbackElement.classList.add('text-danger');
      input.classList.add('is-invalid');
    }
  };

  const renderPosts = (watchedState) => {
    const postsElement = document.querySelector('.posts');
    watchedState.posts.forEach(({ title, link }) => {
      const a = document.createElement('a');
      a.textContent = title;
      a.setAttribute('href', link);
      a.classList.add('link-primary');
      const div = document.createElement('div');
      div.append(a);
      postsElement.append(div);
    });
  };

  const renderFeeds = (watchedState) => {
    const feedsElement = document.querySelector('.feeds');
    watchedState.feeds.forEach(({ title, description }) => {
      const div = document.createElement('div');
      const pTitle = document.createElement('p');
      pTitle.textContent = title;
      const pDescription = document.createElement('p');
      pDescription.textContent = description;
      div.append(pTitle);
      div.append(pDescription);
      feedsElement.append(div);
    });
  };

  const renderNetworkError = (watchedState) => {
    const feedbackElement = document.querySelector('.feedback');
    feedbackElement.textContent = watchedState.networkErrors.message;
  };

  const watchedState = onChange(state, (path) => {
    // eslint-disable-next-line default-case
    switch (path) {
      case 'networkErrors.message':
        renderNetworkError(watchedState);
        break;
      case 'errors.message':
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
    }
  });

  renderFormTexts();
  return watchedState;
};
