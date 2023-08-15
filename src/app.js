import * as yup from 'yup'
import i18next from "i18next";
import render from './view.js'
import axios from "axios";

yup.setLocale({
mixed: {
    notOneOf: () => '',
    required: () => 'urlRequiredErrorMessage'
},
string: {
    url: () => 'urlInvalidErrorMessage'
}
});




const validation = (url, listUrls) => {
  const schema = yup.string().url().required().notOneOf(listUrls);
    return schema.validate(url)
}

export default () => {
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
          button: document.querySelector('.full-article')
        }
    };
    const state = {
      form: {
        feedUrl: '',
        isFeedValid: false,
        error: null,
      },
        feeds: [],
        posts: [],

      postViewState: {
        currentPostId: null,
        visitedPostsId: new Set(),
      },

      displayLoadingFeedback: {
        formStatus: 'filling',
        error: null,
      },
      };
      

elements.form.addEventListener('submit', (even) => {
even.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');
  });
};