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

  const watchedState = onChange(state, (path) => {
    if (path === 'errors.message') {
      renderErrors(watchedState);
    }
    if (path === 'isValid') {
      renderErrors(watchedState);
    }
  });

  renderFormTexts();
  return watchedState;
};
