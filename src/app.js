import * as yup from 'yup'
import i18next from "i18next";
import axios from 'axios';
import _ from 'lodash';

import parseFeedData from './parser.js';
import render from './view.js'
import resources from './locales/index.js';

const timeInterval = 5000;
const timeOut = 1000;

const validation = (url, listUrls) => {
  const schema = yup.string().url().required().notOneOf(listUrls);
    return schema.validate(url)
};
const fetchRemoteContent = (url) => {
 return new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`,
   time: timeOut,
  })
  .then((responce) => resolve(responce))
  .catch((error) => reject(error));
 });
};

const addPostsTostate = (state, newPostsData, feedidentifer) => {
  return new Promise((resolve, reject) => {
    const preparedPosts = newPostsData.map((post) => ({ ...post, feedId: feedidentifer, id: _.uniqueId()}));
    const updateState = { ...state };
    updateState.posts = [...preparedPosts, updateState.posts];
    resolve(updateState);
  });
};

const checkNewPosts = (state) => {
  const fetchPromises = state.feeds
  .map(({ link, feedId }) => {
    fetchRemoteContent(link)
    .then((responce) => {
      const { posts } = parseFeedData(responce.data.contents);
      const existingPostLinks = state.posts.map((post) => post.link);
      const newPosts = posts.filter((post) => !existingPostLinks.includes(post.link));
      if (newPosts.length > 0) {
    addPostsTostate(state, newPosts, feedId);
      }
    return Promise.resolve();
    })
    return Promise.all(fetchPromises)
    .finally(() => {
      setTimeout(() => checkNewPosts(state), timeInterval)
    });
});

};


export default () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
lng: defaultLanguage,
debug: false,
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

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('input[name="url"]'),
        submitBtn: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
        modal: {
          modalWindow: document.querySelector('.modal'),
          title: document.querySelector('.modal-title'),
          body: document.querySelector('.modal-body'),
          button: document.querySelector('.full-article'),
        },
    };
    const state = {
      form: {
        feedUrl: [],
        isFeedValid: false,
        error: null,
      },
        feeds: [],
        posts: [],

      postViewState: {
        currentPostId: null,
        visitedPostsId: new Set(),
      },

      LoadingFeedback: {
        formStatus: 'filling',
        error: null,
      },
      };
const watchedState = render(state, elements, i18nInstance)      

elements.form.addEventListener('submit', (even) => {
even.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');

  const links = watchedState.feeds.map((feed) => feed.url);
  });
});

};