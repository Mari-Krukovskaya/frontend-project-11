
const parseFeedData = (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');

  const parseError = xml.querySelector('parsereerror');
  if (parseError) {
    throw new Error('parseError');
  }
  const feedChannel = xml.querySelector('channel');
  const feedTitle = feedChannel.querySelector('title').textContent;
  const feedDescription = feedChannel.querySelector('description').textContent;
  const feedLink = feedChannel.querySelector('link').textContent;

  const feed = {
    title: feedTitle,
    description: feedDescription,
    link: feedLink,
  };


  const items = [...xml.querySelectorAll('item')];

  const posts = items.map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return { feed, posts };
};

export default parseFeedData;