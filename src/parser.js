const parseData = (data, i18n) => {
  const feeds = [];
  const posts = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');

  const parsererrors = doc.querySelector('parsererror');

  if (parsererrors !== null) {
    throw new Error(i18n.t('feedBackTexts.invalidRSSResource'));
  }

  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;
  feeds.push({ title: feedTitle, description: feedDescription });

  const items = doc.querySelectorAll('item');
  Array.from(items).forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    posts.push({ title: postTitle, link: postLink });
  });

  return { feeds, posts };
};

export default parseData;
