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
  const httpOrigins = 'https://allorigins.hexlet.app/get';
  const proxy = new URL(httpOrigins);
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', url);
  return axios.get(proxy);
};

export default () => {
  const state = {
    validUrl: [],
    form: {
      isFeedValid: true,
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
      
      const handleNewPosts = (watchedState) => {
        const extractedPosts = (posts, uniqId) => {
          const transformedPosts = posts.map((post) => ({
            ...post,
            uniqId,
            id: _.uniqueId(),
          }));
          watchedState.posts.push(...transformedPosts);
        };
      
        const checkNewPosts = () => {
          const { feeds, posts } = watchedState;
          const feedsPromises = feeds.map(({ uniqId, link }) => {
            return buildProxy(link)
              .then(({ data: { contents }}) => {
                const { posts: newPosts } = parseFeedData(contents);
                const oldPosts = posts.map((post) => post.link);
                const filteredNewPosts = newPosts.filter((post) => !oldPosts.includes(post.link));
                if (filteredNewPosts.length > 0) {
                  extractedPosts(filteredNewPosts, uniqId);
                }
              });
          });
      
          Promise.all(feedsPromises)
            .then(() => {
              setTimeout(checkNewPosts, timeInterval);
            })
            .catch((error) => {
              console.error('Error checking new posts:', error);
            });
        };
      
        const handleFormSubmit = (url) => {
          validation(url, watchedState.validUrl)
            .then(() => {
              watchedState.form.isFeedValid = true;
              watchedState.loadingFeedback.formStatus = 'sending';
              return buildProxy(url);
            })
            .then(({ data: { contents }}) => {
              watchedState.validUrl.push(url);
              const { feed, posts } = parseFeedData(contents);
              const uniqId = _.uniqueId();
              watchedState.feeds.push({ ...feed, id: uniqId, link: url });
              extractedPosts(posts, uniqId);
              watchedState.loadingFeedback.formStatus = 'success';
            })
            .catch((error) => {
              watchedState.form.isFeedValid = false;
              watchedState.loadingFeedback.error = error.message ?? 'defaultError';
              watchedState.loadingFeedback.formStatus = 'failed';
            });
        };
      
        elements.form.addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(event.target);
          const url = formData.get('url');
          handleFormSubmit(url);
        });
      
        checkNewPosts();
      };
      
      handleNewPosts(watchedState, timeInterval);

      elements.modalWindow.addEventListener('show.bs.modal', (event) => {
        const id = event.relatedTarget.getAttribute('data-id');
        watchedState.postViewState.visitedPostsId.add(id);
        watchedState.postViewState.currentPostId = id;
      });

      elements.posts.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (id) {
          watchedState.postViewState.visitedPostsId.add(id);
        }
      });
    });
};
