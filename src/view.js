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
  submit.removeAttribute('disabled');
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');

  switch (formStatus) {
    case 'loading':
      input.setAttribute('readonly', 'readonly');
      submit.setAttribute('disabled', 'disabled');
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.remove('text-success');
      feedback.textContent = i18nInstance.t('loading');
      break;

    case 'success':
      input.removeAttribute('readonly');
      submit.removeAttribute('disabled');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t('success');
      form.reset();
      input.focus();
      break;

    case 'failed':
      input.removeAttribute('readonly');
      submit.removeAttribute('disabled');
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t(`error.${error}`);
      break;

    default:
      break;
  }
};
const renderPosts = (state, div, i18nInstance) => {
  const ul = createList();
  state.posts.forEach((post) => {
  const li = createListItem(post, state.postViewState.visitedPostsId, i18nInstance);
  ul.appendChild(li);
  });

div.appendChild(ul);

};
const createList = () => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  return ul;
};

const createListItem = (post, visitedPostsId, i18nInstance) => {
  const { title, link, id } = post;

  const li = document.createElement('li');  
 li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const a = createLink( post, visitedPostsId);
  const button = createButton(id, i18nInstance);

  li.append(a, button);

  return li;
};
const createLink = (post, visitedPostsId) => {
  const { title, link, id } = post;
  
  const a = document.createElement('a');
  a.classList.add(visitedPostsId.includes(id) ? 'fw-normal' : 'fw-bold', 'link-secondary');
  a.setAttribute('href', link);
  a.setAttribute('data-id', id);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'nooper noreferrer');
  a.textContent = title;

  return a;
};

const createButton = (id, i18nInstance) => {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', id);
  button.setAttribute('data-bs-Toggle', 'modal');
  button.setAttribute('data-bs-Target', '#modal');
  button.textContent = i18nInstance.t('button');

  return button;
};


const renderFeeds = (state, elements) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach((feed) => {
  const { title, description } = feed;

  const li = createListitem();
  const h3 = createHeading(title);
  const p = createParagraph(description);

 li.append(h3, p);
 ul.append(li);
});

elements.append(ul);
};

const createListitem = () => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  return li;
}

const createHeading = (title) => {
  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = title;
};

const createParagraph = (description) => {
  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = description;
  return p;
};

const createContainer = (type, watchedState, elements, i18nInstance) => {
  const builders = {
    feeds: renderFeeds,
    posts: renderPosts,
  };

  elements[type].innerHTML = '';

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card title', 'h4');
  h2.textContent = i18nInstance.t(type);

  cardBody.append(h2);
  cardBorder.append(cardBody);
  elements[type].append(cardBorder);

  builders[type](watchedState, cardBorder, i18nInstance);
};

const renderModalWindow = (elements, state, postId) => {
  const { posts } = state;
  const currentPostId = posts.find((post) => post.id === postId);
  const { title, description, link } = currentPostId;

  elements.modal.title.textContent = title;
  elements.modal.body.textContent = description;
  elements.modal.button.setAttribute('href', link)
};


export default (state, elements, i18nInstance) => {
  const { form, loadingFeedback, feeds, posts, postViewState } = state;

  onChange(state, (path, value) => {
    switch (path) {
      case 'form':
        renderForm(value, elements, i18nInstance);
        break;
      case 'loadingFeedback':
        renderLoadingFeedback(value, elements, i18nInstance);
        break;
      case 'feeds':
        renderFeeds(state, elements, i18nInstance);
        break;
      case 'posts': 
      case 'postViewState.visitedPostsId':
        renderPosts(state, elements, i18nInstance);
        break;
      case 'postViewState.currentPostId':
        renderModalWindow(state, value);
        break;
        default:
          break;
    }
    return state;
  });
};