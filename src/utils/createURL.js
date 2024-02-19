const createURL = (link) => {
  const allOriginsProxyUrl = 'https://allorigins.hexlet.app/get?url=';
  return new URL(`${allOriginsProxyUrl}${link}`);
};

export default createURL;
