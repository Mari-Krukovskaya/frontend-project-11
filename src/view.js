const renderPosts = (watchedState, element, i18nInstance) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.posts.forEach(({ title, id, link }) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.dataset.id = id;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;
    const classToAdd = watchedState.postViewState.visitedPostsId.has(id) ? 'fw-normal' : 'fw-bold';
    a.classList.toggle(classToAdd);

    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.dataset.id = id;
    btn.dataset.bsToggle = 'modal';
    btn.dataset.bsTarget = '#modal';
    btn.textContent = i18nInstance.t('button');
    listItem.append(a, btn);

    listGroup.append(listItem);
  });
  element.append(listGroup);
};

const renderFeeds = (watchedState, element) => {
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  watchedState.feeds.forEach(({ title, description }) => {
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

const createContainer = (type, watchedState, elements, i18nInstance) => {
  const building = {
    feeds: (element) => renderFeeds(watchedState, element),
    posts: (element) => renderPosts(watchedState, element, i18nInstance),
  };
  const elementsContainer = elements[type];
  elementsContainer.innerHTML = '';

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.textContent = '';

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance.t(type);

  cardBody.append(cardTitle);
  cardBorder.append(cardBody);
  elementsContainer.append(cardBorder);
  building[type](cardBorder);
};

const renderModalWindow = (watchedState, elements, postId) => {
  const currentPosts = watchedState.posts.find((post) => post.id === postId);
  const { title, description, link } = currentPosts;
  const { modalTitle, modalBody, modalLinkBtn } = elements;
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLinkBtn.setAttribute('href', link);
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
  if (error !== 'Network Error') {
    input.classList.add('is-invalid');
  }

  input.disabled = false;
  submitBtn.disabled = false;
};

const activeFromStatus = (elements, fromStatus, watchedState, i18nInstance) => {
  const { submitBtn } = elements;
  switch (fromStatus) {
    case 'success':
      submitBtn.disabled = false;
      successStatus(elements, i18nInstance);
      break;

    case 'failed':
      submitBtn.disabled = false;
      handleError(elements, watchedState.loadingFeedback.error, i18nInstance);
      break;

    case 'sending':
      submitBtn.disabled = true;
      break;

    case 'filling':
      submitBtn.disabled = false;
      break;

    default:
      throw new Error(`Uknown fromStatus: ${fromStatus}`);
  }
};

export default (watchedState, elements, i18nInstance) => (path, value) => {
  const { submitBtn } = elements;
  switch (path) {
    case 'form.isFeedValid':
      submitBtn.disabled = !value;
      break;

    case 'loadingFeedback.formStatus':
      activeFromStatus(elements, value, watchedState, i18nInstance);
      break;

    case 'loadingFeedback.error':
      handleError(elements, watchedState.loadingFeedback.error, i18nInstance);
      break;

    case 'postViewState.currentPostId':
      renderModalWindow(watchedState, elements, value);
      break;

    case 'postViewState.visitedPostsId':
      createContainer('posts', watchedState, elements, i18nInstance);
      break;

    case 'posts':
      createContainer('posts', watchedState, elements, i18nInstance);
      break;

    case 'feeds':
      createContainer('feeds', watchedState, elements, i18nInstance);
      break;

    default:
      break;
  }
};
