import onChange from "on-change";

export default (initialState, elements, i18nInstance) => {

const renderForm = (state) => {
  const { input, feedback } = elements;
  const { isFeedValid, error } = state.form;
  const { fromStatus } = state.loadingFeedback;

  input.classList.toggle('is-invalid', !isFeedValid || fromStatus === 'failed');
  input.classList.toggle('is-valid', isFeedValid && fromStatus !== 'failed');
  feedback.classList.toggle('text-danger', !isFeedValid || fromStatus === 'failed');
  feedback.classList.toggle('text-success', isFeedValid && fromStatus !== 'failed');
  feedback.textContent = i18nInstance.t(`error.${error}`);
};

const createContainer = (type) => {
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.textContent = '';

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nInstance.t(type);

  cardBody.append(cardTitle);
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');

  return { cardBorder, listGroup };
};


const renderPosts = (state) => {
  const type = 'posts';
  const { posts } = elements;
  posts.innerHTML = '';
  const { cardBorder, listGroup } = createContainer(type);
  posts.append(cardBorder);

  state.posts.forEach(({ title, id, link }) => {
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
    const classToAdd = state.postViewState.visitedPostsId.has(id) ? 'fw-normal' : 'fw-bold';
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

const renderFeeds = (state) => {
  const type = 'feeds';
  const { feeds } = elements;
  feeds.innerHTML = '';

  const { cardBorder, listGroup } = createContainer(type);
  feeds.append(cardBorder)

  state.feeds.forEach(({ title, description }) => {
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
  cardBorder.append(listGroup);
};

const renderModalWindow = (state, postId) => {
  const currentPosts = state.posts.find((post) => post.id === postId);
  const { title, description, link } = currentPosts;
  const { modalTitle, modalBody, modalLinkBtn } = elements;
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLinkBtn.setAttribute('href', link);
};

const activeFromStatus = (state) => {
  const {form, feedback, input, submitBtn } = elements;
  const { fromStatus, error } = state.loadingFeedback;
  switch(fromStatus) {
    case 'sending':
      feedback.textContent = '';
      submitBtn.disabled = true;
      input.disabled = true;
      break;
    case 'success':
      renderForm(state);
      feedback.classList.replace('text-danger', 'text-success');
      feedback.textContent = i18nInstance.t('success');
      submitBtn.disabled = false;
      input.disabled = false;
      input.focus();
      form.reset();
      break;
      
   case 'failed':
    renderForm(state);
    feedback.classList.replace('text-success', 'text-danger');
    feedback.textContent = i18nInstance.t(`error.${error}`);
    submitBtn.disabled = false;
    input.disabled = false;
    input.focus();
    form.reset();
    break;
    default:
      throw new Error(`Uknown fromStatus: ${fromStatus}`);
  }
};

 const state = onChange(initialState, (path) => {
  switch (path) {
    case 'form':
     renderForm(state)
      break;

      case 'loadingFeedback':
        activeFromStatus(state);
      break;

    case 'postViewState.visitedPostsId':
    case 'posts':
      renderPosts(state);
      break;

    case 'feeds':
      renderFeeds(state);
      break;
    case 'postViewState.currentPostId':
      renderModalWindow(state);
    default:
      break;
  }
});
  return state;
};
