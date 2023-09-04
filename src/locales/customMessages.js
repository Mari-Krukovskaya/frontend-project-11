import i18next from 'i18next';

export default {
  mixed: {
    notOneOf: () => i18next.t('error.rssAlreadyExists'),
    required: () => i18next.t('error.empty'),
  },
  string: {
    url: () => i18next.t('error.invalidUrl'),
  },
};
