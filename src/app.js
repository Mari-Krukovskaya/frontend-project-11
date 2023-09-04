import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';

import parseFeedData from './parser.js';
import render from './view.js';
import resources from './locales/index.js';
import customMessages from './locales/customMessages.js';

const timeOut = 1000;
const timeInterval = 5000;
const defaultLanguage = 'ru';

const validate = (url, listUrls) => {
  const schema = yup.string().url().required().notOneOf(listUrls);
  return schema
    .validate(url)
    .then(() => null)
    .catch((error) => error.message);
};

const buildProxy = (url) => {
  const proxy = new URL('/get', 'https://allorigins.hexlet.app');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', url);
  return proxy.toString();
};

const linkPosts = (state, posts, uniqId) => {
  const transformedPosts = posts.map((post) => ({
    ...post,
    uniqId,
    id: _.uniqueId(),
  }));
  state.posts.push(...transformedPosts);
};

const loadData = (state, url) => {
  const newState = { ...state };
  newState.loadingFeedback = { formStatus: 'sending', error: null };
  return axios({
    method: 'get',
    url: buildProxy(url),
    timeout: timeOut,
  })
    .then(({ data }) => {
      const { feed, posts } = parseFeedData(data.contents);
      const uniqId = _.uniqueId();
      newState.feeds.push({ ...feed, id: uniqId, link: url });
      linkPosts(newState, posts, uniqId);
      newState.loadingFeedback = {
        error: null,
        formStatus: 'success',
      };
    })
    .catch((error) => {
      newState.loadingFeedback.formStatus = 'failed';
      if (error.isParsingError) {
        newState.loadingFeedback.error = 'invalidFeed';
      } else if (error.isAxiosError) {
        newState.loadingFeedback.error = 'networkError';
      } else {
        newState.loadingFeedback.error = 'defaultError';
      }
    });
};

const checkNewPosts = (state) => {
  const feedsPromises = state.feeds.map(({ uniqId, link }) => axios({
    method: 'get',
    url: buildProxy(link),
    timeout: timeOut,
  })
    .then(({ data }) => {
      const { posts: newPosts } = parseFeedData(data.contents);
      const oldPosts = state.posts.map((post) => post.link);
      const everyNewPosts = newPosts.every((post) => !oldPosts.includes(post.link));
      if (everyNewPosts) {
        linkPosts(state, newPosts, uniqId);
      }
      return Promise.resolve();
    }));

  return Promise.all(feedsPromises)
    .finally(() => {
      setTimeout(() => checkNewPosts(state), timeInterval);
    });
};

export default () => {
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
      currentPostId: null,
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
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  })
    .then(() => {
      yup.setLocale(customMessages);
      const watchedState = render(initState, elements, i18nInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url').trim();
        const feedUrls = watchedState.feeds.map((feed) => feed.url);

        validate(url, feedUrls)
          .then((error) => {
            if (error) {
              watchedState.form = {
                isFeedValid: false,
                error: error.message,
              };
              return;
            }
            watchedState.form = {
              isFeedValid: true,
              error: '',
            };
            loadData(url, watchedState);
          });
      });

      elements.posts.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (!id) {
          return;
        }
        watchedState.postViewState.currentPostId = id;
        watchedState.postViewState.visitedPostsId.add(id);
      });
      checkNewPosts(watchedState);
    });
};
