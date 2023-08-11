import { fetchPhoto } from './api_request';
import { refs } from './refs';
import { createMarkupGallery } from './markup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

refs.searchForm.addEventListener('submit', onSubmitForm);

const paramsNotiflix = {
  position: 'center-center',
  timeout: 1000,
  width: '700px',
  fontSize: '24px',
};

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
// const searchPhoto = data.hits;
let page = 1;
const perPage = 40;
let q = '';
let pageNumber = 0;
// задаємо опціі для нескінченного скролу
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);
// перебираємо, і коли вьюпорт перетинається з межею 300пікселів додаємо сторінку

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (pageNumber === 1) {
        observer.unobserve(refs.target);
        return;
      }
      page += 1;
      fetchPhoto(q, page, perPage).then(data => {
        const searchPhoto = data.hits;
        refs.gallery.insertAdjacentHTML(
          'beforeend',
          createMarkupGallery(searchPhoto)
        );
      });
      if (page === pageNumber) {
        Notify.info(
          'We`re sorry, but you`ve reached the end of search results.',
          paramsNotiflix
        );
        observer.unobserve(refs.target);
      }
      lightbox.refresh();
    }
  });
}

function onSubmitForm(event) {
  event.preventDefault();
  q = refs.searchInput.value;
  page = 1;
  refs.gallery.innerHTML = '';

  if (q === '') {
    refs.gallery.innerHTML = '';
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    handleFetchPhoto();
  }
}

function handleFetchPhoto() {
  fetchPhoto(q, page, perPage)
    .then(data => {
      const searchPhoto = data.hits;
      // якщо немає зображень по запиту
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          paramsNotiflix
        );
      } else {
        // повідомлення, в якому буде написано, скільки всього знайшли зображень
        Notify.success(
          `Hooray! We found ${data.totalHits} images.`,
          paramsNotiflix
        );
        refs.gallery.insertAdjacentHTML(
          'beforeend',
          createMarkupGallery(searchPhoto)
        );
        observer.observe(refs.target);
        // обов'язково потрібно викликати щоразу після додавання нової групи карток зображень.
        lightbox.refresh();
      }
    })
    .catch(err => console.log(err));
}
