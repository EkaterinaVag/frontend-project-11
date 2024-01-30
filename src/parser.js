import { DOMParser } from '@xmldom/xmldom';

const parseData = (data) => {
  const feeds = [];
  const posts = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const items = doc.getElementsByTagName('item');
  Array.from(items).forEach((item) => {
    const postTitle = item.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const postLink = item.getElementsByTagName('link')[0].childNodes[0].nodeValue;
    posts.push({ title: postTitle, link: postLink });
  });
  const feedTitle = doc.getElementsByTagName('title')[0].childNodes[0].nodeValue;
  const feedDescription = doc.getElementsByTagName('description')[0].childNodes[0].nodeValue;
  feeds.push({ title: feedTitle, description: feedDescription });

  return { feeds, posts };
};

export default parseData;
