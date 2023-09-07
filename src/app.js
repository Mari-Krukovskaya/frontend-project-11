import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';

import parseFeedData from './parser.js';
import render from './view.js';
import resources from './locales/index.js';
import customMessages from './locales/customMessages.js';

const timeInterval = 5000;
const defaultLanguage = 'ru';

const validate = (url, listUrls) => {
  const schema = yup.string().url().required().notOneOf(listUrls);
  return schema
    .validate(url)
    .then(() => null)
    .catch((error) => error);
};

const buildProxy = (url) => {
  const proxy = new URL('/get', 'https://allorigins.hexlet.app');
  proxy.searchParams.set('disableCache', true);
  proxy.searchParams.set('url', url);
  return proxy.toString();
};

const linkPosts = (watchedState, posts, uniqId) => {
  const transformedPosts = posts.map((post) => ({
    ...post,
    uniqId,
    id: _.uniqueId(),
  }));
  watchedState.posts.push(...transformedPosts);
};

const handlerError = (error) => {
  console.log(error, 'er')
  switch (error.name) {
    case 'AxiosError':
      return 'networkError';

    case 'ParserError':
      return 'invalidFeed';

    default:
      return 'defaultError';
  }
};

const loadData = (watchedState, url) => {
  // eslint-disable-next-line no-param-reassign
  watchedState.loadingFeedback = { formStatus: 'sending', error: '' };
  return axios({
    method: 'get',
    url: buildProxy(url),
  })
    .then(({ data }) => {
      const { feed, posts } = parseFeedData(data.contents);
      const uniqId = _.uniqueId();
      // eslint-disable-next-line no-param-reassign
      watchedState.feeds.push({ ...feed, id: uniqId, link: url });
      linkPosts(watchedState, posts, uniqId);
      // eslint-disable-next-line no-param-reassign
      watchedState.loadingFeedback = {
        error: '',
        formStatus: 'success',
      };
    })
    .catch((error) => {
      // eslint-disable-next-line no-param-reassign
      watchedState.loadingFeedback = {
        error: handlerError(error),
        formStatus: 'failed',
      };
      return Promise.reject(error);
    });
};

const checkNewPosts = (watchedState) => {
  const feedsPromises = watchedState.feeds.map(({ uniqId, link }) => axios({
    method: 'get',
    url: buildProxy(link),
  })
    .then(({ data }) => {
      const { posts: newPosts } = parseFeedData(data.contents);
      const oldPosts = watchedState.posts.map((post) => post.link);
      const everyNewPosts = newPosts.filter((post) => !oldPosts.includes(post.link));

      if (everyNewPosts.length > 0) {
        linkPosts(watchedState, newPosts, uniqId);
      }
      return Promise.resolve();
    }));

  return Promise
    .all(feedsPromises)
    .finally(() => {
      setTimeout(() => checkNewPosts(watchedState, timeInterval), timeInterval);
    });
};

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  })
    .then(() => {
      yup.setLocale(customMessages);

      const initState = {
        form: {
          isFeedValid: true,
          error: '',
        },
        loadingFeedback: {
          formStatus: 'filling',
          error: '',
        },
        postViewState: {
          currentPostId: '',
          visitedPostsId: new Set(),
        },
        feeds: [],
        posts: [],
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('.form-control'),
        submitBtn: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
        modalWindow: document.querySelector('.modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        modalLinkBtn: document.querySelector('.full-article'),
      };

      const watchedState = render(initState, elements, i18nInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url').trim();
        const feedUrls = watchedState.feeds.map((feed) => feed.url);

        validate(url, feedUrls)
          .then(() => {
            watchedState.form = {
              isFeedValid: true,
              error: null,
            };
            loadData(watchedState, url);
          })
          .catch((error) => {
            watchedState.form = {
              isFeedValid: false,
              error: error.message,
            };
          });
      });

      elements.modalWindow.addEventListener('show.bs.modal', (event) => {
        const id = event.relatedTarget.getAttribute('data-id');
        watchedState.postViewState.visitedPostsId.add(id);
        watchedState.postViewState.currentPostId = id;
      });

      elements.posts.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (!id) {
          return;
        }

        watchedState.postViewState.visitedPostsId.add(id);
      });
      checkNewPosts(watchedState);
    });
};
