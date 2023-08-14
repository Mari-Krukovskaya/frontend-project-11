import * as yup from 'yup';


const urlShema = yup.string().url('Введите корректный URL');

export const validateForm = (url, feeds) => {
  const schema = yup.object().shape({
    url: urlShema
    .notOneOf(feeds, 'Такой URL уже существует')
    .required('Введите URL')
  });
  return schema 
  .validate({ url })
  .then(() => null)
  .catch((error) => error);
};