import * as yup from 'yup'
import i18next from "i18next";
import axios from 'axios';
import setLocale from 'yup';
import onChange from 'on-change';
import _ from 'lodash';


import parseFeedData from './parser.js';
import render from './view.js'
import resources from './locales/index.js';


const timeInterval = 5000;
const defaultLanguage = 'ru';


const validation = (url, listUrls) => {
  const schema = yup.string().url().required().notOneOf(listUrls);
  return schema.validate(url)
    .then(() => null)
    .catch((error) => error);
};

const buildProxy = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', url);
  return axios.get(proxy);
}

const extractedPosts = (watchedState, posts, feedId) => {
  const transformedPosts = posts.map((post) => ({
    ...post,
    feedId,
    id: _.uniqueId(),
  }));
  watchedState.posts.push(...transformedPosts);
};

// const formStatusError = (error) => {
//   const errorTypes = {
//     AxiosError: 'connectionError',
//     ParserError: 'invalidFeed',
//   };
//   return errorTypes[error.name] || 'defaultError';
// };


// const fetchRemoteContent = (url, watchedState) => {
//   watchedState.LoadingFeedback = {
//     formStatus: 'loading', error: null
//   };

//   return axios({
//     method: 'get',
//     url: buildProxy(url),
//     timeout: timeOut,
//   })
//       .then((response) => {
//         const { feed, posts } = parseFeedData(response.data.contents);
//         feed.url = url;
//         feed.id = _.uniqueId();

//         posts.forEach((post) => {
//           post.id = _.uniqueId();
//           post.feedId = feed.id;
//         });
//         watchedState.LoadingFeedback = {
//           formStatus: 'success',
//           error: null
//         },
//           watchedState.feeds.push(feed);
//         watchedState.posts.push(...posts);

//       })
//       .catch((error) => {
//         watchedState.LoadingFeedback = {
//           formStatus: 'failed',
//           error: formStatusError(error),
//         };
//       })
// };

const checkNewPosts = (watchedState) => {

  const updatePromises = watchedState.feeds
    .map(({ feedId, link }) => {

      return buildProxy(link)
        .then((response) => {
          const { posts } = parseFeedData(response.data.contents);

          const existingPostLinks = watchedState.posts.map((post) => post.link);
          const filteredNewPosts = posts.filter((post) => !existingPostLinks.includes(post.link));

          if (filteredNewPosts.length > 0) {
            extractedPosts(watchedState, filteredNewPosts, feedId);
          }

          return Promise.resolve();
        })
        .catch((error) => {
          console.log(error);
        });
    });

  return Promise.all(updatePromises)

    .finally(() => {
      setTimeout(() => checkNewPosts(watchedState), timeInterval);
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

      const state = {
        form: {
          isFeedValid: false,
          error: null,
        },
        LoadingFeedback: {
          formStatus: 'filling',
          error: null,
        },
        postViewState: {
          currentPostId: null,
          visitedPostsId: new Set(),
        },

        feeds: [],
        posts: [],
        isFeedUrls: [],
      };


      const watchedState = onChange(state, render(state, elements, i18nInstance));
      checkNewPosts(watchedState);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        watchedState.LoadingFeedback.formStatus = 'filling';
        const formData = new FormData(event.target);
        const urlValue = formData.get('url').trim();
         const links = watchedState.feeds.map((feed) => feed.urlValue);

        validation(urlValue, links)
          .then((validurl) => {
            watchedState.LoadingFeedback.error = null;
            watchedState.LoadingFeedback.formStatus = 'sending';
            return buildProxy(validurl);
          })
          .then(({ data }) => {
            const [feed, posts ] = parseFeedData(data.contents);
            const newFeed = { ...feed, id: _.uniqueId(), urlValue};
           const newPosts = posts.map((post) => ({ ...post, id: _.uniqueId(), feedId: newFeed.id }));

            watchedState.feeds = [newFeed, ...watchedState.feeds];
            watchedState.posts = [...newPosts, ...watchedState.posts];
            watchedState.LoadingFeedback.formStatus = 'success';
          
          })
          .catch((error) => {
           watchedState.form.isFeedValid = error.name !== 'ValidationError';
           if (error.name === 'ValidationError') {
            watchedState.LoadingFeedback.error = error.message;
           } else if (error.invalidFeed) {
            watchedState.LoadingFeedback.error = 'error.invalidFeed';
           } else if (axios.isAxiosError(error)) {
            watchedState.LoadingFeedback.error = 'error. connectionError';
           }
           watchedState.LoadingFeedback.formStatus = 'filling';
          });
      });

      //   validation(urlValue, watchedState.isFeedUrls)
      //     .then((error) => {
      //       if (error) {
      //         watchedState.form = {
      //           isFeedValid: false,
      //           error: error.message,
      //         };
      //         return Promise.reject();
      //       }
      //       watchedState.form = {
      //         isFeedValid: true,
      //         error: null,
      //       };
      //       return fetchRemoteContent(urlValue);
      //     })
      //     .then(() => {
      //       watchedState.LoadingFeedback = {
      //         ...watchedState.LoadingFeedback,
      //         formStatus: 'success',
      //       }
      //     })
      //     .catch(() => {
      //       watchedState.LoadingFeedback = {
      //         ...watchedState.LoadingFeedback,
      //         formStatus: 'failed',
      //         error: 'networkError',
      //       };
      //     });
      // });

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
    })
};






