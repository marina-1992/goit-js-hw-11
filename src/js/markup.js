import { refs } from './refs';

export function createMarkupGallery(arr) {
  return arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      
              <a class="image-link" href="${largeImageURL}">
                  <img class="img" src="${webformatURL}" alt="${tags}"  loading="lazy" />
              </a>
          
              <div class="info">
              <p class="info-item">
                <b>Likes: ${likes}</b>
              </p>
              <p class="info-item">
                <b>Views: ${views}</b>
              </p>
              <p class="info-item">
                <b>Comments: ${comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads: ${downloads}</b>
              </p>
            </div>
    </div>`
    )
    .join('');
}
