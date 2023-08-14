
import i18next from "i18next";
import render from './view.js'








// yup.setLocale({
// mixed: {
//     notOneOf: () => '',
//     required: () => 'urlRequiredErrorMessage'
// },
// string: {
//     url: () => 'urlInvalidErrorMessage'
// }
// });




// const validation = (url, Listurls) => {
//   const schema = yup.string().url().required().notOneOf(Listurls);
//     return schema.validate(url)
// }

// export default () => {

//     const elements = {
//         form: document.querySelector('.rss-form'),
//         input: document.querySelector('input[name="url"]')
//     };
//     const state = {
//         form: {
//             isValid: null,
//             error: null,
//           },
//           loadingData: {
//             status: 'filling',
//             error: null,
//           },
//           posts: [],
//           feeds: [],
  
//           uiState: {
//             postId: null,
//             visitedPostsId: new Set(),
//           },
//         };
      

// elements.form.addEventListener('submit', (even) => {
// even.preventDefault();
//   const formData = new FormData(e.target);
//   const url = formData.get('url');
//   });
// };