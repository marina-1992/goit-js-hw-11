// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.
// У відповіді буде масив зображень, що задовольнили критерії параметрів запиту. Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
import { fetchPhoto } from "./api_request";
import { refs } from "./refs";
import { createMarkupGallery } from "./markup";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

refs.searchForm.addEventListener('submit', onSubmitForm);

// const { gallery, searchForm, loadMore } = refs;
// const image = response.data.hits
const paramsNotiflix = {
  position: 'center-center',
  timeout: 1000,
  width: '700px',
  fontSize: '24px',
};

let lightbox = new SimpleLightbox('.image-wrap a', {
        captionsData: 'alt',
  captionDelay: 250,
});
    
let page = 1;
const perPage = 40;
let keyOfPhoto = "";
// задаємо опціі для нескінченного скролу
 let options = {
  root: null,
  rootMargin: "300px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);  
// перебираємо, і коли вьюпорт перетинається з межею 300пікселів додаємо сторінку
function onLoad(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
    
    page += 1;
    fetchPhoto(keyOfPhoto, page, perPage)
      .then((data) => { 
        const searchPhoto = data.hits;
        refs.gallery.insertAdjacentHTML('beforeend', createMarkupGallery(searchPhoto));
        if (data.page === data.perPage) {
           observer.unobserve(refs.target);
        }})
  .catch((err) => console.log(err));
  }  
 })
};

// loadMore.addEventListener('click', onLoadMore);

// function onLoadMore() {
//   page +=1;

// }
fetchPhoto(keyOfPhoto, page, perPage)
  .then(data => {
    const searchPhoto = data.hits;
    // якщо немає зображень по запиту
    if (data.totalHits === 0 ) {
      Notify.failure(
      "Sorry, there are no images matching your search query. Please try again.", paramsNotiflix)
    } else {
      // повідомлення, в якому буде написано, скільки всього знайшли зображень
       Notify.info(
         `Hooray! We found ${data.totalHits} images.`, paramsNotiflix)
      refs.gallery.insertAdjacentHTML('beforeend', createMarkupGallery(searchPhoto));
     observer.observe(refs.target)
      // обов'язково потрібно викликати щоразу після додавання нової групи карток зображень.
      lightbox.refresh()
    }
  }) .catch((err) => console.log(err));

function onSubmitForm(event) {
  event.preventDefault();

}