import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import _ from 'lodash';

import parseFeedData from './parser.js';
import render from './view.js';
import resources from './locales/index.js';

const timeInterval = 5000;
const defaultLanguage = 'ru';

const validation = (url, listUrls) => {
  const schema = yup.string().url().required().notOneOf(listUrls);
  return schema.validate(url);
};

const buildProxy = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', url);
  return axios.get(proxy);
};

const extractedPosts = (watchedState, posts, feedId) => {
  const transformedPosts = posts.map((post) => ({
    ...post,
    feedId,
    id: _.uniqueId(),
  }));
  watchedState.posts.push(...transformedPosts);
};

const checkNewPosts = (watchedState) => {
  const feedsPromises = watchedState.feeds.map(({ feedId, link }) => buildProxy(link)
    .then((response) => {
      const { posts } = parseFeedData(response.data.contents);
      const oldPosts = watchedState.posts.map((post) => post.link);
      const filteredNewPosts = posts.filter((post) => !oldPosts.includes(post.link));
      if (filteredNewPosts.length > 0) {
        extractedPosts(watchedState, filteredNewPosts, feedId);
      }
      return Promise.resolve();
    }));
  Promise.all(feedsPromises)
    .finally(() => {
      setTimeout(() => checkNewPosts(watchedState), timeInterval);
    });
};

export default () => {
  const state = {
    form: {
      isFeedValid: true,
      error: '',
    },
    LoadingFeedback: {
      formStatus: 'filling',
      error: '',
    },
    postViewState: {
      currentPostId: '',
      visitedPostsId: new Set(),
    },

    feeds: [],
    posts: [],
    validUrl: [],
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
      yup.setLocale({
        mixed: {
          notOneOf: 'rssAlreadyExists',
          required: 'empty',
        },
        string: {
          url: 'invalidUrl',
        },
      });
      const watchedState = onChange(state, render(state, elements, i18nInstance));
      checkNewPosts(watchedState);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');

        validation(url, watchedState.validUrl)
          .then(() => {
            watchedState.form.isFeedValid = true;
            watchedState.LoadingFeedback.formStatus = 'sending';
            return buildProxy(url);
          })
          .then((response) => {
            const data = response.data.contents;
            watchedState.validUrl.push(url);
            const { feed, posts } = parseFeedData(data);
            const feedId = _.uniqueId();
            watchedState.feeds.push({ ...feed, id: feedId, link: url });
            extractedPosts(watchedState, posts, feedId);
            watchedState.LoadingFeedback.formStatus = 'success';
          })
          .catch((error) => {
            watchedState.form.isFeedValid = false;
            watchedState.LoadingFeedback.error = error.message ?? 'defaultError';
            watchedState.LoadingFeedback.formStatus = 'failed';
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
          watchedState.postViewState.visitedPostsId.add(id);
        }
      });
    });
};
