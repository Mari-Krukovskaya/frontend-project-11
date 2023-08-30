const parseFeedData = (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');
  const parseError = xml.querySelector('parsererror');
  if (parseError) {
    const invalidFeed = new Error(parseError.textContent);
    invalidFeed.isParsingError = true;
    throw new Error('invalidFeed');
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
