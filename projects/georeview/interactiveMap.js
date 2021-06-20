/* global ymaps*/

export default class InteractiveMap {
  constructor(mapId, onClick) {
    this.mapId = mapId;
    this.onClick = onClick;
  }

  async init() {
    await this.injectYMapsScript();
    await this.loadYMaps();
    this.initMap();
  }

  injectYMapsScript() {
    return new Promise((resolve) => {
      const ymapsScript = document.createElement('script');
      ymapsScript.src =
        'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=e631409f-3014-44a7-80d2-cfa0cc5ac8cd';
      document.body.appendChild(ymapsScript);
      ymapsScript.addEventListener('load', resolve);
    });
  }

  loadYMaps() {
    return new Promise((resolve) => ymaps.ready(resolve));
  }

  initMap() {
    // прокидываем кластер в класс
    this.clusterer = new ymaps.Clusterer({
      groupByCoordinates: true,
      clustererDisableClickZoom: true,
      clustererOpenBalloonOnClick: false,
    });
    // добавляем обработкчик кликов по кластерам
    this.clusterer.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordiinates();
      this.onClick(coords);
    });
    // добавляем карту в свойство объекта
    this.map = new ymaps.Map(this.mapId, {
      center: [54.19, 37.61],
      zoom: 10,
    });
    // добавляем события на эту карту
    this.map.events.add('click', (e) => this.onClick(e.get('coords')));
    // добавляем объекты из кластера
    this.map.geoObjects.add(this.clusterer);
  }
  // открыть балун
  openBalloon(coords, content) {
    this.map.balloon.open(coords, content);
  }
  // установить контент балуна
  setBalloonContent(content) {
    this.map.balloon.setData(content);
  }
  // закрыть балун
  closeBalloon() {
    this.map.balloon.close();
  }
  // создаёт точку на карте
  createPlacemark(coords) {
    const placemark = new ymaps.Placemark(coords);
    // вешаем обработку кликов по точкам чтоб добавлять форму при показе балуна
    placemark.events.add('click', (e) => {
      const coords = e.get('target').geometry.getCoordiinates();
      this.onClick(coords);
    });
    // после того, как плейсмарк создан, пихаем его в кластер
    this.clusterer.add(placemark);
  }
}
