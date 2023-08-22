import * as yup from 'yup'
import i18next from "i18next";
import axios from 'axios';
import _ from 'lodash';


import parseFeedData from './parser.js';
import render from './view.js'
import resources from './locales/index.js';


const timeInterval = 5000;
const defaultLanguage = 'ru';


const buildProxy = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', url);
  return axios.get(proxy);
}

//

const checkNewPosts = (watchedState) => {
  console.log('///////', watchedState)
  const { feeds, posts } = watchedState;
  console.log('feeds', feeds)
  const updatePromises = feeds.map(({ url, id }) =>
    buildProxy(url)
      .then(({ data }) => {
        const [, filteredPosts] = parseFeedData(data.contents);
        const oldPosts = posts.filter((post) => post.feedId === id);

        const addedPosts = filteredPosts.filter((filteredPost) => {
          return !oldPosts.some((oldPost) => oldPost.links === filteredPost.links)
        });
        if (addedPosts.length !== 0) {
          const newPosts = addedPosts.map((post) => ({
            ...post,
            id: _.uniqueId(),
            feedId: id,
          }));
          watchedState, posts = [...newPosts, ...posts]
        }
      })
      .catch(console.error)
  )
  Promise.all(updatePromises)

    .finally(() => {
      setTimeout(() => checkNewPosts(watchedState), timeInterval);
    })

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
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submitBtn: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modal: {
      modalWindow: document.querySelector('.modal'),
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      linkBtn: document.querySelector('.full-article'),
    },
  };
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  })
    .then(() => {
      const watchedState = render(state, elements, i18nInstance);

      yup.setLocale({
        mixed: {
          notOneOf: 'rssAlreadyExists',
          required: 'empty',
        },
        string: {
          url: 'invalidUrl',
        },
      });

      const validation = (url, listUrls) => {
        const schema = yup.string().url().required().notOneOf(listUrls);
        return schema.validate(url)
      };



      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        watchedState.LoadingFeedback = { formStatus: 'filling' };
        const formData = new FormData(event.target);
        const url = formData.get('url');
        const links = watchedState.feeds.map((feed) => feed.url);
console.log('links....', links)
        validation(url, links, i18nInstance)
          .then((valid) => {
            watchedState.LoadingFeedback = { formStatus: 'sending', error: null };
            return buildProxy(valid);
          })
          .then(({ data }) => {
            const [feed, posts] = parseFeedData(data.contents);
            const newFeed = { ...feed, id: _.uniqueId(), url };
            const newPosts = posts.map((post) => ({ ...post, id: _.uniqueId(), feedId: newFeed.id }));

            watchedState.feeds = [newFeed, ...watchedState.feeds];
            watchedState.posts = [...newPosts, ...watchedState.posts];
            watchedState.LoadingFeedback = { formStatus: 'success' };

          })
          .catch((error) => {
            watchedState.form.isFeedValid = error.name !== 'ValidationError';
            if (error.name === 'ValidationError') {
              watchedState.LoadingFeedback.error = error;
            } else if (error.invalidFeed) {
              watchedState.LoadingFeedback.error = 'error.invalidFeed';
            } else if (axios.isAxiosError(error)) {
              watchedState.LoadingFeedback.error = 'error. connectionError';
            }
            watchedState.LoadingFeedback = { formStatus: 'filling' };
          });
      });


      elements.modal.modalWindow.addEventListener('show.bs.modal', (event) => {
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
      setTimeout(() => checkNewPosts(watchedState), timeInterval);
    });
};






