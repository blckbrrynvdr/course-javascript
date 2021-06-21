const ymaps = window.ymaps;

ymaps.ready(init);

const storageName = 'geo-review';

function init() {
  const map = new ymaps.Map('map', {
    center: [54.19, 37.61],
    zoom: 13,
  });

  // создаём кластер для поддержки кластеризации
  const clusterer = new ymaps.Clusterer({
    groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
  });
  // добавляем обработчик кликов по кластеру
  clusterer.events.add('click', (e) => {
    const coords = e.get('target').geometry.getCoordinates();
    openReviews(coords);
  });
  // добавляем обработчик кликов по карте
  map.events.add('click', (e) => {
    const coords = e.get('coords');

    openBalloon(coords, createForm(coords));
  });

  // добавляем наш кластер на карту
  map.geoObjects.add(clusterer);

  // открыть балун
  const openBalloon = (coords, content) => {
    map.balloon.open(coords, content);
  };

  // закрыть балун
  const closeBalloon = () => {
    map.balloon.close();
  };

  // открыть отзывы
  const openReviews = (coords) => {
    const list = storageGetData(coords);
    console.log('list in operReviews', list);
    const form = createForm(coords, list);
    openBalloon(coords, form);
  };

  const createPlacemark = (coords) => {
    const placemark = new ymaps.Placemark(coords);
    // вешаем обработку кликов по точкам чтоб добавлять форму при показе балуна
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordinates();

      openReviews(coords);
    });

    // после того, как плейсмарк создан, пихаем его в кластер
    clusterer.add(placemark);
  };

  const createForm = (coords, reviews) => {
    // получаем шаблон формы
    const container = document.createElement('div');
    container.innerHTML = document.querySelector('#addCommentForm').innerHTML;
    const form = container.querySelector('form');
    // находим контейнер списка отзывов
    const reviewList = container.querySelector('.commentsList');
    // записываем в дата атрибут координаты
    form.dataset.coords = JSON.stringify(coords);

    // перебираем отзывы и отрисовываем в балуне
    if (reviews) {
      for (const item of reviews) {
        const div = document.createElement('div');
        div.classList.add('commentsList__item', 'commentItem');
        const { name, place, text, time } = item.review;
        console.log(name, place, text);
        div.innerHTML = `
          <div class="commentItem">
            <div class="commentItem__head">
              <span class="commentItem__autor">${name}</span>
              <span class="commentItem__info">${place}</span>
              <span class="commentItem__info">${time}</span>
            </div>
            <div class="commentItem__text">${text}</div>
          </div>
          `;
        reviewList.appendChild(div);
      }
    }

    return container.innerHTML;
  };

  const addReview = (e) => {
    e.preventDefault();
    if (e.target.dataset.action === 'add-review') {
      // ищем форму
      const form = document.querySelector('form[data-form=add-review]');
      // получаем её координаты
      const coords = JSON.parse(form.dataset.coords);
      const date = new Date();
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const month =
        date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      console.log('day', day);
      const time = `${day}.${month}.${date.getFullYear()}`;
      // получаем остальные данные отзыва
      const data = {
        coords: coords,
        review: {
          name: form.elements.name.value,
          place: form.elements.place.value,
          text: form.elements.review.value,
          time: time,
        },
      };
      storageAddReview(data);
      createPlacemark(coords);
      closeBalloon();
    }
  };

  document.addEventListener('click', addReview);

  // получить отзывы по координатам из localStorage
  const storageGetData = (coords = '') => {
    let data = JSON.parse(localStorage.getItem(storageName));
    console.log('databefore filterred', data);
    console.log('coords for filter', coords);
    if (coords.length > 0) {
      data = data.filter((element) => element.coords.join('') === coords.join(''));
    }
    console.log('data filterred', data);
    return data;
  };

  // добавить ревью в localStorage
  const storageAddReview = async (data) => {
    let reviews = storageGetData();
    if (reviews === null) {
      reviews = [];
    }
    reviews.push(data);
    localStorage.setItem(storageName, JSON.stringify(reviews));
  };

  const onInit = () => {
    const coords = storageGetData();
    if (coords === null) {
      return false;
    }
    for (const item of coords) {
      createPlacemark(item.coords);
    }
  };
  onInit();
}
