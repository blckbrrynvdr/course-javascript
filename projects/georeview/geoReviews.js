import InteractiveMap from './interactiveMap';

export default class GeoReview {
  constructor() {
    // сохраняем шаблон формы в объекте
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    // прокидываем карту
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    // инициализируем карту
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    const coords = await this.callApi('coords');

    for (const item of coords) {
      for (let i = 0; i < item.total; i++) {
        this.map.createPlacemark(item.coords);
      }
    }

    document.body.addEventListener('click', this.onDocumentClick.bind(this));
  }

  // получить данные
  async callApi(method, body = {}) {
    const res = await fetch(`/geo-review/${method}`, {
      method: 'post',
      body: JSON.stringify(body),
    });

    return await res.json();
  }
  // функция создания формы, вохвращает форму
  createForm(coords, reviews) {
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('.review-list');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);
    // перебираем поступившие отзывы и отрисовываем
    for (const item of reviews) {
      const div = document.createElement('div');
      div.classList.add('review-item');
      div.innerHTML = `
        <div>
            <b>${item.name}</b> [${item.place}]
        </div>
        <div>${item.text}</div>
        `;
      reviewList.appendChild(div);
    }

    return root;
  }
  // функция открытия балуна с нашей формой
  async onClick(coords) {
    this.map.openBalloon(coords, 'Загрузка...');
    const list = await this.callApi('list', { coords });
    const form = this.createForm(coords, list);
    this.map.setBalloonContent(form.innerHTML);
  }
  // при клике на документ
  async onDocumentClick(e) {
    // если кликнули на добавление отзыва
    if (e.target.dataset.role === 'review-add') {
      // находим "форму"
      const reviewForm = document.querySelector('[data-role=review-form]');
      // получаем координаты
      const coords = JSON.parse(reviewForm.dataset.coords);
      // получаем все данные
      const data = {
        coords,
        review: {
          name: document.querySelector('data-role=review-name').value,
          place: document.querySelector('data-role=review-place').value,
          text: document.querySelector('data-role=review-text').value,
        },
      };

      try {
        // отправляем на сервер данные по отзыву
        await this.callApi('add', data);
        // добавляем на карту марку
        this.map.createPlacemark(coords);
        // закрываем балун
        this.map.closeBalloon();
      } catch (e) {
        const formError = document.querySelector('.form-error');
        formError.innerText = e.message;
      }
    }
  }
}
