const parseFeedData = (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'application/xml');
  const parseError = xml.querySelector('parsereerror');
  if (parseError) {
    throw new Error('parseError');
  }

  const feedTitle = xml.querySelector('channel > title').textContent;
  const feedDescription = xml.querySelector('channel > description').textContent;
  const feedLink = xml.querySelector('channel > link').textContent;

  const feed = {
    title: feedTitle,
    description: feedDescription,
    link: feedLink,
  };
  const items = [...xml.querySelectorAll('channel > item')];
  const posts = items.map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return { feed, posts };
};

export default parseFeedData;
