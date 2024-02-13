import onChange from 'on-change';

export default (i18n, state) => {
  const renderFormTexts = () => {
    const staticTextElements = {
      readMore: document.querySelector('.full-article'),
      closeModal: document.querySelector('button[data-bs-dismiss="modal"]'),
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
    const postsElement = document.querySelector('.posts');

    watchedState.posts.forEach(({
      title, link, description, id,
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
      post.classList.add('link-primary', 'fw-bold');
      divForPost.append(post);

      const divForButton = document.createElement('div');
      divForButton.setAttribute('class', 'd-grid gap-2 d-md-flex justify-content-md-end col-3');
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'btn btn-outline-primary btn-sm');
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = `#postModal-${id}`;
      button.textContent = i18n.t('interfaceTexts.postButton');
      divForButton.append(button);

      generalDiv.append(divForPost, divForButton);
      postsElement.append(generalDiv);

      const divModal = document.createElement('div');
      divModal.classList.add('modal', 'fade');
      divModal.setAttribute('id', `postModal-${id}`);
      divModal.innerHTML = `<div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">${title}</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      ${description}
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('interfaceTexts.closeButton')}</button>
                      <a href=${link} target="_blank" type="button" class="btn btn-primary">${i18n.t('interfaceTexts.readButton')}</a>
                  </div>
              </div>
          </div>`;
      document.body.appendChild(divModal);
    });

    const existingTitle = postsElement.querySelector('h4');
    if (!existingTitle) {
      const postsElementTitle = document.createElement('h4');
      postsElementTitle.classList.add('lh-lg');
      postsElementTitle.textContent = i18n.t('posts');
      postsElement.prepend(postsElementTitle);
    }
  };

  const renderFeeds = (watchedState) => {
    const feedsElement = document.querySelector('.feeds');

    watchedState.feeds.forEach(({ title, description }) => {
      const divForFeed = document.createElement('div');
      const feedTitle = document.createElement('h6');
      feedTitle.textContent = title;
      const feedDescription = document.createElement('p');
      feedDescription.classList.add('text-secondary');
      feedDescription.textContent = description;
      divForFeed.append(feedTitle, feedDescription);
      feedsElement.append(divForFeed);
    });

    const existingTitle = feedsElement.querySelector('h4');
    if (!existingTitle) {
      const feedsElementTitle = document.createElement('h4');
      feedsElementTitle.classList.add('lh-lg');
      feedsElementTitle.textContent = i18n.t('feeds');
      feedsElement.prepend(feedsElementTitle);
    }
  };

  const renderTouchedPosts = (watchedState) => {
    watchedState.uiState.touchedPosts.forEach((post) => {
      post.classList.remove('fw-bold', 'link-primary');
      post.classList.add('fw-normal', 'link-secondary');
    });
  };

  const watchedState = onChange(state, (path) => {
    // eslint-disable-next-line default-case
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
    }
  });

  renderFormTexts();
  return watchedState;
};
