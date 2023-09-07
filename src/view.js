import onChange from 'on-change';

const renderForm = (value, elements, i18nInstance) => {
  const { isFeedValid, error } = value;
  const { input, feedback } = elements;

  input.classList.toggle('is-invalid', !isFeedValid);
  feedback.classList.toggle('text-success', isFeedValid);
  feedback.classList.toggle('text-danger', !isFeedValid);
  feedback.textContent = isFeedValid ? '' : i18nInstance.t(`error.${error}`);
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

  watchedState.feeds.forEach(({ title, description }) => {
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
  cardBorder.append(listGroup);
};

const renderPosts = (watchedState, elements, i18nInstance) => {
  const type = 'posts';
  const { posts } = elements;
  posts.textContent = '';

  const { cardBorder, listGroup } = createContainer(i18nInstance, type);
  posts.append(cardBorder);

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

  submitBtn.disabled = false;
  input.disabled = false;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger', 'text-success');

  switch (formStatus) {
    case 'success':
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t('success');
      form.reset();
      input.focus();
      break;

    case 'sending':
      submitBtn.disabled = true;
      feedback.classList.add('text-success');
      break;

    case 'failed':
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t(`error.${error}`);
      input.focus();
      form.reset();
      break;

    case 'filling':
      break;

    default:
      throw new Error(`Unknown form status: ${formStatus}`);
  }
};

const renderModalWindow = (watchedState, elements) => {
  const { modalTitle, modalBody, modalLinkBtn } = elements;
  const { currentPostId } = watchedState.postViewState;
  const { title, description, link } = watchedState.posts.find((post) => post.id === currentPostId);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLinkBtn.href = link;
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
