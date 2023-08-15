import onChange from "on-change";

const renderForm = (value, elements, i18nInstance) => {
    const { isFeedValid, error } = value;
    const { input, feedback } = elements;
  
    input.classList.toggle('is-invalid', !isFeedValid);
    feedback.classList.toggle('text-success', isFeedValid);
    feedback.classList.toggle('text-danger', !isFeedValid);
    feedback.textContent = !isFeedValid ? i18nInstance.t(`error.${error}`) : '';
  };

const renderLoadingFeedback = (value, elements, i18nInstance) => {
  const  { formStatus, error } = value;
  const  { form, input, submit, feedback } = elements;

  input.removeAttribute('readonly');
  submit.removeAttribute('desabled');
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-success', 'text-danger');

  switch(formStatus) {
    case 'loading':
      input.setAttribute('readonly', 'readonly');
      submit.setAttribute('disabled', 'disabled');
      feedback.textContent = i18nInstance.t('success');
      form.reset();
      input.focus();
      break;
    case 'failed':
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t(`error.${error}`);
      break;
      default:
        break;
  }
};

export default (state, elements, i18nInstance) => {
 
};