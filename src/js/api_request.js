import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38696137-0a6b9787b2b59d7133eac1c9a';
// axios.defaults.headers.common["x-api-key"] =
//   '38696137-0a6b9787b2b59d7133eac1c9a';

export async function fetchPhoto(q, page, perPage) {
  try {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per-page=${perPage}`
    const response = await axios.get(url)
    return (response.data)
  } catch (error) {
    console.error(error.message);
    Notify.failure(
      'Oops! Something went wrong! Try reloading the page or select another animal!',
      {
        position: 'center-center',
        timeout: 1000,
        width: '700px',
        fontSize: '24px',
      })
  }
};

