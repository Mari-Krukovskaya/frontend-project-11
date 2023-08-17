import * as yup from 'yup'
import i18next from "i18next";
import axios from 'axios';
import _ from 'lodash';

import parseFeedData from './parser.js';
import render from './view.js'
import resources from './locales/index.js';

const timeInterval = 5000;
const timeOut = 1000;
const defaultLanguage = 'ru';

const validation = (url, listUrls) => {
  const schema = yup.string().url().required().notOneOf(listUrls);
    return schema.validate(url)
};

const formStatusError = (error) => {
  const errorTypes = {
    AxiosEroor: 'connectionError',
    ParserError: 'invalidFeed',
  };
  return errorTypes[error.name] || 'defaultError';
};


const fetchRemoteContent = (url) => {
watchedState.LoadingFeedback = { formStatus: 'loading', error: null };

 return axios({
    method: 'get',
    url: `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`,
   time: timeOut,
  })
  .then((responce) => {
    const { feed, posts } = parseFeedData(responce.data.contents);
    feed.url = url;
    feed.id = _.uniqueId();

    posts.forEach((post) => {
      post.id = _.uniqueId();
      post.feedId = feed.id;
    });
    watchedState.LoadingFeedback = {formStatus: 'success', error: null };
    watchedState.feeds.push(feed);
    watchedState.posts.push(...posts);
 })
 .catch((error) => {
  watchedState.LoadingFeedback = { formStatus: 'failed', error: formStatusError(error)}
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
      // checkNewPosts(watchedState);
  
elements.form.addEventListener('input', (even) => {
 even.preventDefault();
 watchedState.LoadingFeedback.formStatus = 'loading';
 watchedState.form.inputUrl = e.target.value;
});

elements.form.addEventListener('submit', (even) => {
even.preventDefault();
  const formData = new FormData(e.target);
  const urls = formData.get('url');
   const links = watchedState.feeds.map(({ link }) => link);

  validation(urls, links)
  .then((error) => {
    if (error) {
      watchedState.form = { isFeedValid: false, error: error.message };
      return;
    }
watchedState.form = { isFeedValid: true, error: null };
fetchRemoteContent(urls, watchedState) 
   });
 });
elements.modal.modalWindow.addEventListener('how.bs.modal', (even) => {
  const postId = even.relatedTarget.getAttribute('data-id');
  watchedState.postViewState.visitedPostsId.push(postId);
  watchedState.postViewState.currentPostId = postId;
});

  elements.posts.addEventListener('click', (even) => {
    const { id } = even.target.dataset;
    if (!id) {
      return;
    }
    watchedState.postViewState.currentPostId = id;
    watchedState.postViewState.visitedPostsId.add(id);
  });
});
  }








