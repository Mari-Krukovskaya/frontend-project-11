

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


const renderPosts = (watchedState, element, i18nInstance) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.posts.forEach((post) => {
    const listItem = document.createElement('li');
    listGroup.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0');
    const { title, id, link } = post;

    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;
    a.classList.add(watchedState.postViewState.visitedPostsId.has(id) ?
      'fw-normal' : 'fw-bold');

    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('data-id', id);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.textContent = i18nInstance.t('button');

    listItem.append(a, btn);
    listGroup.append(listItem);
  });
  element.append(listGroup);
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


const renderFeeds = (watchedState, element) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.feeds.forEach((feed) => {
    const { title, description } = feed;

    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3Title = document.createElement('h3');
    h3Title.classList.add('h6', 'm-0');
    h3Title.textContent = title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;

    listItem.append(h3Title, p);
    listGroup.append(listItem);
  });
  element.append(listGroup);
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



const createContainer = (type, watchedState, elements, i18nInstance) => {

  const building = {
    feeds: (element) => renderFeeds(watchedState, element),
    posts: (element) => renderPosts(watchedState, element, i18nInstance),
  };
  elements[type].innerHtml = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance(type);

  cardBody.append(cardTitle);
  card.append(cardBody);
  elements[type](card);
  building[type](card)
};

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
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  feedback.textContent = i18nInstance.t(`error.${error.replace(/ /g, '')}`);

  input.classList.toggle('is-invalid', error !== 'Connection Error');
  input.classList.toggle('is-invalid', error === 'Connection Error');

    submitBtn.disabled = false;
    input.disabled = false;
};

const activeFromStatus = (elements, fromStatus, watchedState, i18nInstance) => {
  const { submitBtn } = elements;
  switch (fromStatus) {
    case 'success':
    case 'filling':
       submitBtn.disabled = false;
      successStatus(elements, i18nInstance);
      break;

    case 'failed':
       submitBtn.disabled = false;
      handleError(elements, watchedState.LoadingFeedback.error, i18nInstance, watchedState);
      break;

    case 'sending':
      submitBtn.disabled = true;
      break;

    default:
      throw new Error(`Uknown fromstatus: ${fromStatus}`);
  }
};

export default (elements, watchedState, i18nInstance) => (path, value) => {
  console.log('.........c.',value)
  switch (path) {
    case 'form.isFeedValid':
      elements.submitBtn.disabled = true;;
      break;

    case 'LoadingFeedback.formStatus':
      activeFromStatus(elements, value, watchedState, i18nInstance);
      break;

    case 'LoadingFeedback.error':
      handleError(elements, value, watchedState, i18nInstance);
      break;

    case 'postViewState.currentPostId':
      renderModalWindow(watchedState, elements, value);
      break;

    case 'posts':
    case 'postViewState.visitedPostsId':
      createContainer('posts', watchedState, elements, i18nInstance);
      break;

    case 'feeds':
      createContainer('feeds', watchedState, elements, i18nInstance);
      break;

    default:
      break;

  }
};
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
