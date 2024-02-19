const createTitle = (container, text) => {
  const existingTitle = container.querySelector('h4');
  if (!existingTitle) {
    const title = document.createElement('h4');
    title.classList.add('lh-lg');
    title.textContent = text;
    container.prepend(title);
  }
};

export default createTitle;
