// ymaps.ready(init);

// const placemarks = [
//     {
//       latitude: 59.97,
//       longitude: 30.31,
//       hintContent: '<div class="map__hint">ул. Литерторов, д. 19</div>',
//       balloonContent: [
//         '<div class="map__balloon">',
//         '<img class="map__burger-img" src="images/slider1.png" alt="батончики">',
//         'Самые вкусные батончики тут! Заходите по адресу: ул. Литерторов, д. 19',
//         '</div>',
//       ],
//     },
//     {
//       latitude: 59.94,
//       longitude: 30.25,
//       hintContent: '<div class="map__hint">Малый проспект ВО, д.64</div>',
//       balloonContent: [
//         '<div class="map__balloon">',
//         '<img class="map__burger-img" src="images/slider1.png" alt="батончики">',
//         'Самые вкусные батончики тут! Заходите по адресу: Малый проспект ВО, д.64',
//         '</div>',
//       ],
//     },
//     {
//       latitude: 59.93,
//       longitude: 30.34,
//       hintContent: '<div class="map__hint">Наб. реки Фонтанки, дю 56</div>',
//       balloonContent: [
//         '<div class="map__balloon">',
//         '<img class="map__burger-img" src="images/slider1.png" alt="батончики">',
//         'Самые вкусные батончики тут! Заходите по адресу: Наб. реки Фонтанки, дю 56',
//         '</div>',
//       ],
//     },
//     {
//       latitude: 59.92,
//       longitude: 30.49,
//       hintContent: '<div class="map__hint">просп. Солидарности, 11, корп. 2</div>',
//       balloonContent: [
//         '<div class="map__balloon">',
//         '<img class="map__burger-img" src="images/slider1.png" alt="батончики">',
//         'Самые вкусные батончики тут! Заходите по адресу: просп. Солидарности, 11, корп. 2',
//         '</div>',
//       ],
//     },
//   ],
//   geoObjects = [];

// function init() {
//   const map = new ymaps.Map('map', {
//     center: [59.94, 30.32],
//     zoom: 12,
//     // controls: ['zoomControl'],
//     // behaviors: ['drag'],
//   });

//   //   for (let i = 0; i < placemarks.length; i++) {
//   //     console.log(placemarks[i].balloonContent.join(''));
//   //     geoObjects[i] = new ymaps.Placemark(
//   //       [placemarks[i].latitude, placemarks[i].longitude],
//   //       {
//   //         hintContent: placemarks[i].hintContent,
//   //         balloonContent: placemarks[i].balloonContent.join(''),
//   //         properties: {
//   //           clusterCaption: 'Геообъект № ' + (i + 1),
//   //           balloonContentBody: 'Текст балуна № ' + (i + 1),
//   //         },
//   //       }
//   //     );
//   //   }

//   for (let i = 0; i < placemarks.length; i++) {
//     geoObjects[i] = new ymaps.GeoObject({
//       geometry: {
//         type: 'Point',
//         coordinates: [placemarks[i].latitude, placemarks[i].longitude],
//       },
//       properties: {
//         clusterCaption: placemarks[i].hintContent,
//         balloonContentBody: placemarks[i].balloonContent.join(''),
//       },
//     });
//   }

//   const clusterer = new ymaps.Clusterer({
//     clusterDisableClickZoom: true,
//   });

//   clusterer.add(geoObjects);

//   map.geoObjects.add(clusterer);

//   const getAddress = (coords) => {
//     ymaps.geocode(coords).then((result) => {
//       result.geoObjects.get(0).getAddressLine();
//     });
//   };

//   map.events.add('click', (e) => {
//     console.log('click map');
//     const coords = e.get('coords');
//     console.log(coords);
//     // getAddress(coords);
//   });
// }
