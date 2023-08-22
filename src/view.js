import onChange from "on-change";

// const renderForm = (value, elements, i18nInstance) => {
//   const { isFeedValid, error } = value;
//   const { input, feedback } = elements;

//   input.classList.toggle('is-invalid', isFeedValid === false);
//   feedback.classList.toggle('text-success', isFeedValid !== false);
//   feedback.classList.toggle('text-danger', isFeedValid === false);
//   feedback.textContent = isFeedValid === false ? i18nInstance.t(`error.${error}`) : '';
// };


// const renderForm = (value, elements, i18nInstance) => {
//   const { isFeedValid, error } = value;
//   const { input, feedback } = elements;

//   input.classList.add('is-invalid', !isFeedValid);
//   feedback.classList.remove('text-success', isFeedValid);
//   feedback.classList.add('text-danger', !isFeedValid);
//   feedback.textContent = !isFeedValid ? i18nInstance.t(`error.${error}`) : '';
// };




// const renderLoadingFeedback = (value, elements, i18nInstance) => {
//   const { formStatus, error } = value;
//   const { form, input, submitBtn, feedback } = elements;

// input.readonly = formStatus === 'loading';
// submitBtn.disabled = formStatus === 'loading';

// input.classList.toggle('is-invalid', formStatus === 'failed');
// feedback.classList.toggle('text-danger', formStatus === 'failed');
// feedback.classList.toggle('text-success', formStatus === 'success');


//   switch (formStatus) {
//     case 'loading':
//       feedback.textContent = i18nInstance.t('loading');
//       break;

//     case 'success':
//       feedback.textContent = i18nInstance.t('success');
//       form.reset();
//       input.focus();
//       break;

//     case 'failed':
//       feedback.textContent = i18nInstance.t(`error.${error}`);
//       break;

//     default:
//       break;
//   }
// };
// const createContainer = (i18nInstance, type) => {
//   const cardBorder = document.createElement('div');
//   const cardBody = document.createElement('div');
//   const cardTitle =  document.createElement('h2');
//   const listGroup = document.createElement('ul');

//   cardBorder.classList.add('card', 'border-0');
//   cardBody.classList.add('card-body');
//   cardTitle.classList.add('card-title', 'h4');
//   listGroup.classList.add('list-group', 'border-0', 'rounded-0');

//   cardBorder.append(cardBody);
//   cardBody.append(cardTitle);

//   cardTitle.textContent = i18nInstance.t(type);

//   return { cardBorder, listGroup };
//  }

const renderPosts = (watchedState, elements, i18nInstance) => {
  elements.posts.innerHTML = '';
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0');
  elements.posts.prepend(divCard);

  const divBody = document.createElement('div');
  divBody.classList.add('card-body');
  divCard.append(divBody);

  const h2Title = document.createElement('h2');
  h2Title.classList.add('card-title', 'h4');
  h2Title.textContent = i18nInstance.t('posts.title');
  divBody.prepend(h2Title);


  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.posts.forEach(({ id, title, link }) => {
    const classes = watchedState.postViewState.visitedPostsId.has(id) ? 'fw-normal link-secondary' : 'fw-bold';

    const listItem = document.createElement('li');
    listGroup.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0');


    const a = document.createElement('a');
    a.setAttribute('class', classes);
    a.setAttribute('href', link);
    a.dataset.id = id;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;
    listItem.append(a)

    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.dataset.id = id;

    btn.setAttribute('target', '_blank');
    btn.dataset.bsToggle = 'modal';
    btn.dataset.bsTarget = '#modal';
    btn.textContent = i18nInstance.t('posts.button');
    listItem.append(btn);

    listGroup.append(listItem);
  });
  divCard.append(listGroup);
};


// const renderPosts = (watchedState, elements, i18nInstance) => {
//   const type = 'posts';
//   const { posts } = elements;
//   posts.textContent = '';

//   const { cardBorder, listGroup } = createContainer(i18nInstance, type);
//   cardBorder.append(listGroup);
// posts.append(cardBorder);

//   watchedState.posts.forEach((post) => {
//     const {id, link, title } = post;

//     const listItem = document.createElement('li');
//     listItem.classList.add(
//       'list-group-item',
//        'd-flex',
//         'justify-content-between',
//          'align-items-start',
//           'border-0',
//            'border-end-0'
//            );

//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', link);
//     linkElement.setAttribute('data-id', id);
//     linkElement.setAttribute('target', '_blank');
//     linkElement.setAttribute('rel', 'noopener noreferrer');
//     linkElement.textContent = title;
//           linkElement.classList.add(watchedState.postViewState.visitedPostsId.has(id) ? 
//    'fw-normal' : 'fw-bold');

//     const button = document.createElement('button');
//     button.setAttribute('type', 'button');
//     button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
//     button.setAttribute('data-id',id);
//     button.setAttribute('target', '_blank');
//     button.setAttribute('data-bs-toggle', 'modal');
//     button.setAttribute('data-bs-target', '#modal');
//     button.textContent = i18nInstance.t('button');

//     listItem.append(linkElement, button);
//     listGroup.prepend(listItem);
//   });
// };


const renderFeeds = (watchedState, elements, i18nInstance) => {
  elements.posts.innerHTML = '';
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0');
  elements.posts.prepend(divCard);

  const divBody = document.createElement('div');
  divBody.classList.add('card-body');
  divCard.append(divBody);

  const h2Title = document.createElement('h2');
  h2Title.classList.add('card-title', 'h4');
  h2Title.textContent = i18nInstance.t('feeds.title');
  divBody.prepend(h2Title);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.feeds.forEach((feed) => {
    const { title, description } = feed;
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3Title = document.createElement('h3');
    h3Title.classList.add('h6', 'm-0');
    h3Title.textContent = title;
    listItem.append(h3Title);

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;
    listItem.append(p);

    listGroup.append(listItem);
  });
  divCard.append(listGroup);
};



// const renderFeeds = (watchedState, elements, i18nInstance) => {
//   const type = 'feeds';
//   const { feeds } = elements;
//   feeds.textContent = '';

//   const { cardBorder, listGroup } = createContainer(i18nInstance, type);
//   cardBorder.append(listGroup)
//   feeds.append(cardBorder);

//   watchedState.feeds.forEach((feed) => {
//     const { title, description } = feed;

//     const listItem = document.createElement('li');
//     listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

//     const titleElement = document.createElement('h3');
//     titleElement.classList.add('h6', 'm-0');
//     titleElement.textContent = title;
//     listItem.prepend(titleElement);

//     const descriptionElement = document.createElement('p');
//     descriptionElement.classList.add('m-0', 'small', 'text-black-50');
//     descriptionElement.textContent = description;
//     listItem.append(descriptionElement);

//     listGroup.prepend(listItem);
//   });

//   cardBorder.append(listGroup);
// };




// const createContainer = (type, watchedState, elements, i18nInstance) => {

//   const building = {
//     feeds: (element) => renderFeeds(watchedState, element),
//     posts: (element) => renderPosts(watchedState, element, i18nInstance),
//   };
//   elements[type].innerHtml = '';

//   const card = document.createElement('div');
//   card.classList.add('card', 'border-0');

//   const cardBody = document.createElement('div');
//   cardBody.classList.add('card-body');

//   const cardTitle = document.createElement('h2');
//   cardTitle.classList.add('card-title', 'h4');
//   cardTitle.textContent = i18nInstance(type);

//   cardBody.append(cardTitle);
//   card.append(cardBody);
//   elements[type](card);
//   building[type](card)
// };

const renderModalWindow = (watchedState, postId, elements) => {
  const currentPosts = watchedState.posts.find(({ id }) => id === postId);
  const { title, description, link } = currentPosts;

  elements.modal.title.textContent = title;
  elements.modal.body.textContent = description;
  elements.modal.linkBtn.setAttribute('href', link);
};


const successStatus = (elements, i18nInstance) => {
  const { feedback, input, form } = elements;
  feedback.classList.add('text-success');
  feedback.classList.remove('text-danger');
  input.classList.remove('is-invalid');
  feedback.textContent = i18nInstance.t('success');
  form.reset();
  input.focus();
};


const handleError = (elements, error, i18nInstance) => {
  const { feedback, input, submitBtn } = elements;
  input.readOnly = false;
  submitBtn.disabled = false;
  feedback.textContent = '';
  submitBtn.textContent = 'Добавить';
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = i18nInstance.t(`error.${error.replace(/ /g, '')}`);

  input.classList.add('is-invalid', error !== 'Connection Error');
  input.classList.add('is-invalid', error === 'Connection Error');

};

const activeFromStatus = (elements, fromStatus, watchedState, i18nInstance) => {
  switch (fromStatus) {
    case 'success':
    case 'filling':
      elements.input.readOnly = false;
      elements.submitBtn.disabled = false;
      successStatus(elements, i18nInstance);
      break;

    case 'failed':
      elements.submitBtn.disabled = false;
      handleError(elements, watchedState.LoadingFeedback.error, i18nInstance, watchedState);
      break;

    case 'sending':
      elements.submitBtn.disabled = true;
      break;


    default:
      throw new Error(`Uknown fromstatus: ${fromStatus}`);
  }
};

export default (elements, state, i18nInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.isFeedValid':
      elements.submitBtn.disabled = !value;
      break;

    case 'LoadingFeedback.formStatus':
      activeFromStatus(elements, value, state, i18nInstance);
      break;

    case 'LoadingFeedback.error':
      handleError(elements, value, state, i18nInstance);
      break;

    case 'postViewState.currentPostId':
      renderModalWindow(state, elements, value);
      break;

    case 'posts':
    case 'postViewState.visitedPostsId':
      renderPosts('posts', state, elements, i18nInstance);
      break;

    case 'feeds':
      renderFeeds('feeds', state, elements, i18nInstance);
      break;

    default:
      break;

  }
});
// export default (state, elements, i18nInstance) => {
//   onChange(state, (path, value) => {

//     switch (path) {
//   case 'form':
//     renderForm(value, elements, i18nInstance);
//     break;

//       case 'LoadingFeedback':
//         renderLoadingFeedback(value, elements, i18nInstance);
//         break;

//         case 'feeds':
//           renderFeeds(state, elements, i18nInstance);
//           break;

//           case 'posts':
//           case 'postViewState.visitedPostsId':
//             renderPosts(state, elements, i18nInstance);
//             break;

//           case 'postViewState.currentPostId':
//             renderModalWindow(state, value);
//             break;

//       default:
//         break;
//     }
//     return state;
//   });

// };
