import onChange from "on-change";















// const renderForm = (value, elements, i18nInstance) => {
//     const { isValid, error } = value;
//     const { input, feedback } = elements;
  
//     input.classList.toggle('is-invalid', !isValid);
//     feedback.classList.toggle('text-success', isValid);
//     feedback.classList.toggle('text-danger', !isValid);
//     feedback.textContent = !isValid ? i18nInstance.t(`error.${error}`) : '';
//   };


// const renderFeedback = (state, elements) => {
//   const { feedback, form, input } = elements;
//   const { status, message } = state.form.status;

//   feedback.classlist.remove('text-danger', 'text-success');

//   if (status === 'success') {
//     feedback.classlist.add('text-success');
//     form.reset();
//     form.focus();
//   } else {
//     feedback.classlist.add('text-danger');
//   }
//   feedback.textContent = message

// }
// export default (state, elements, i18nInstance) => {
 
// };