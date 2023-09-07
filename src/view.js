import onChange from 'on-change';

const renderForm = (value, elements, i18nInstance) => {
  const { isFeedValid, error } = value;
  const { input, feedback } = elements;

  if (isFeedValid === false) {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(`error.${error}`);
  } else {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
  }
};

const createContainer = (i18nInstance, type) => {
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBorder.append(cardBody);

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance.t(type);
  cardBorder.append(cardTitle);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  return { cardBorder, listGroup };
};

const renderFeeds = (watchedState, elements, i18nInstance) => {
  const type = 'feeds';
  const { feeds } = elements;
  feeds.textContent = '';

  const { cardBorder, listGroup } = createContainer(i18nInstance, type);
  feeds.append(cardBorder);

  watchedState.feeds.forEach((feed) => {
    const { title, description } = feed;
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3Title = document.createElement('h3');
    h3Title.classList.add('h6', 'm-0');
    h3Title.textContent = title;
    listItem.prepend(h3Title);

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;
    listItem.append(p);

    listGroup.prepend(listItem);
  });
  cardBorder.append(listGroup);
};

const renderPosts = (watchedState, elements, i18nInstance) => {
  const type = 'posts';
  const { posts } = elements;
  posts.textContent = '';

  const { cardBorder, listGroup } = createContainer(i18nInstance, type);
  posts.append(cardBorder);

  watchedState.posts.forEach((post) => {
    const { title, id, link } = post;
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

  cardBorder.append(listGroup);
};

const activeFromStatus = (value, elements, i18nInstance) => {
  const { formStatus, error } = value;
  const {
    form,
    feedback,
    input,
    submitBtn,
  } = elements;

  if (formStatus === 'success') {
    submitBtn.disabled = false;
    input.disabled = false;
    feedback.classList.replace('text-danger', 'text-success');
    feedback.textContent = i18nInstance.t('success');
    form.reset();
    input.focus();
  }
  if (formStatus === 'sending') {
    submitBtn.disabled = true;
    input.disabled = true;
    input.classList.remove('is-invalid');
    feedback.classList.replace('text-danger', 'text-success');
  }
  if (formStatus === 'failed') {
    submitBtn.disabled = false;
    input.disabled = false;
    input.classList.add('is-invalid');
    feedback.classList.replace('text-success', 'text-danger');
    feedback.textContent = i18nInstance.t(`error.${error}`);
  } if (formStatus === 'filling') {
    submitBtn.disabled = false;
  }
};
const renderModalWindow = (watchedState, elements) => {
  const { modalTitle, modalBody, modalLinkBtn } = elements;
  const { currentPostId } = watchedState.postViewState;
  const currentPost = watchedState.posts.find((post) => post.id === currentPostId);
  const { title, description, link } = currentPost;
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLinkBtn.setAttribute('href', link);
};

export default (state, elements, i18nInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form':
      renderForm(value, elements, i18nInstance);
      break;

    case 'loadingFeedback':
      activeFromStatus(value, elements, i18nInstance);
      break;

    case 'postViewState.visitedPostsId':
      renderPosts(state, elements, i18nInstance);
      break;

    case 'posts':
      renderPosts(state, elements, i18nInstance);
      break;

    case 'feeds':
      renderFeeds(state, elements, i18nInstance);
      break;
    case 'postViewState.currentPostId':
      renderModalWindow(state, elements);
      break;
    default:
      break;
  }
  return state;
});
