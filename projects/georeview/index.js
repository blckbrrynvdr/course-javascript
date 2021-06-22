const ymaps = window.ymaps;

const hasOwnProperty = Object.prototype.hasOwnProperty;

ymaps.ready(init);

const storageName = 'geo-review';

function init() {
  const map = new ymaps.Map('map', {
    center: [54.19, 37.61],
    zoom: 13,
  });

  // создаём кластер для поддержки кластеризации
  const clusterer = new ymaps.Clusterer({
    // groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
  });
  // добавляем обработчик кликов по кластеру
  clusterer.events.add('click', (e) => {
    const target = e.get('target');
    const coords = target.geometry.getCoordinates();

    openReviews(coords, target);
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
  const openReviews = (coords, targetClusterer) => {
    // если нажатый кластер имеет несколько кластеров
    if (hasOwnProperty.call(targetClusterer, '_clusterListeners')) {
      // начинаем делать грязЪ
      const places = {};
      // перебираем кластеры
      targetClusterer.getGeoObjects().forEach((obj) => {
        // формируем данные под карусельку
        const objectCoordiates = obj.geometry.getCoordinates();
        const coordinateId = objectCoordiates.join('');
        const coordsData = storageGetData(objectCoordiates);
        const placeData = {
          data: coordsData,
          address: coordsData[0].address,
          coordsId: coordinateId,
        };
        places[objectCoordiates] = placeData;
      });
      openBalloon(coords, createCarousel(places));
      console.log('places', places);
    }

    // const list = storageGetData(coords);

    // const form = createForm(coords, list);
    // openBalloon(coords, form);
  };

  function createCarousel(data) {
    const container = document.createElement('div');
    container.innerHTML = document.querySelector('#carouselTemplate').innerHTML;
    const controlsWrap = container.querySelector('.carousel__controls-box');
    const contentWrap = container.querySelector('.carousel__content');

    for (const tab in data) {
      const currentTab = data[tab];
      const controlElement = document.createElement('button');
      controlElement.classList.add('carousel__control');
      controlElement.dataset.role = 'control-btn';
      controlElement.textContent = currentTab.address;
      controlsWrap.append(controlElement);

      const contentTab = document.createElement('div');
      contentTab.classList.add('carousel__tab');

      console.log('data[tab].data', data[tab].data);
      currentTab.data.forEach((review) => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('commentsList__item', 'commentItem');
        const { name, place, text, time } = review;

        reviewDiv.innerHTML = `
          <div class="commentItem">
            <div class="commentItem__head">
              <span class="commentItem__autor">${name}</span>
              <span class="commentItem__info">${place}</span>
              <span class="commentItem__info">${time}</span>
            </div>
            <div class="commentItem__text">${text}</div>
          </div>
          `;
        contentTab.append(reviewDiv);
      });
      contentWrap.append(contentTab);
    }

    return container.innerHTML;
  }

  const createPlacemark = (coords) => {
    const placemark = new ymaps.Placemark(coords);

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

  const addReview = async (e) => {
    e.preventDefault();
    if (e.target.dataset.action === 'add-review') {
      // ищем форму
      const form = document.querySelector('form[data-form=add-review]');
      // получаем её координаты
      const coords = JSON.parse(form.dataset.coords);

      const address = await getAddress(coords);
      // получаем остальные данные отзыва
      const data = {
        coords: coords,
        address: address,
        review: {
          name: form.elements.name.value,
          place: form.elements.place.value,
          text: form.elements.review.value,
          time: getDateNow(),
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

    if (coords.length > 0) {
      data = data.filter((element) => element.coords.join('') === coords.join(''));
    }

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

function getDateNow() {
  const date = new Date();
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  return `${day}.${month}.${date.getFullYear()}`;
}

async function getAddress(coords) {
  const address = await ymaps.geocode(coords);
  const res = address.geoObjects.get(0).getAddressLine();
  // .then((result) => {
  //   return result.geoObjects.get(0).getAddressLine();
  // });
  return res;
}
