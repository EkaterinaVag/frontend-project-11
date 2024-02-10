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
      divForPost.classList.add('fs-6', 'fw-bold', 'col-8');

      const post = document.createElement('a');
      post.textContent = title;
      post.setAttribute('href', link);
      post.classList.add('link-primary');
      divForPost.append(post);

      const divForButton = document.createElement('div');
      divForButton.setAttribute('class', 'd-grid gap-2 d-md-flex justify-content-md-end col-3');
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'btn btn-outline-primary btn-sm');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', `#${id}`);
      button.textContent = i18n.t('interfaceTexts.postButton');
      divForButton.append(button);

      generalDiv.append(divForPost, divForButton);
      postsElement.append(generalDiv);

      button.addEventListener('click', () => {
        const divModal = document.createElement('div');
        divModal.setAttribute('class', 'modal fade');
        divModal.setAttribute('id', id);
        divModal.setAttribute('tabindex', '-1');
        divModal.setAttribute('aria-labelledby', 'postModalLabel');
        divModal.setAttribute('aria-hidden', 'true');

        const divModalDialog = document.createElement('div');
        divModalDialog.classList.add('modal-dialog');

        const divModalContent = document.createElement('div');
        divModalContent.classList.add('modal-content');

        const divModalHeader = document.createElement('div');
        divModalHeader.classList.add('modal-header');
        const header = document.createElement('h1');
        header.setAttribute('class', 'modal-title fs-5');
        header.setAttribute('id', 'postModalLabel');
        header.textContent = title;
        const closeButton = document.createElement('button');
        closeButton.setAttribute('class', 'btn-close');
        closeButton.setAttribute('type', 'button');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'close');
        divModalHeader.append(header, closeButton);

        const divModalBody = document.createElement('div');
        divModalBody.classList.add('modal-body');
        const contentBody = document.createElement('p');
        contentBody.textContent = description;
        divModalBody.append(contentBody);

        const divModalFooter = document.createElement('div');
        divModalFooter.classList.add('modal-footer');
        const closeContentButton = document.createElement('button');
        closeContentButton.setAttribute('type', 'button');
        closeContentButton.setAttribute('class', 'btn btn-secondary');
        closeContentButton.setAttribute('data-bs-dismiss', 'modal');
        closeContentButton.textContent = i18n.t('interfaceTexts.closeButton');
        const readMoreButton = document.createElement('button');
        readMoreButton.setAttribute('type', 'button');
        readMoreButton.setAttribute('class', 'btn btn-primary');
        readMoreButton.textContent = i18n.t('interfaceTexts.readButton');
        divModalFooter.append(closeButton, readMoreButton);

        divModal.append(
          divModalDialog,
          divModalContent,
          divModalHeader,
          divModalBody,
          divModalFooter,
        );
      });
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
    }
  });

  renderFormTexts();
  return watchedState;
};
