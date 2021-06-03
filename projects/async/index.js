/* eslint-disable prettier/prettier */
/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns.html

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

import './towns.html';

const homeworkContainer = document.querySelector('#app');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
  return new Promise((resolve, reject) => {
    const url =
      'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
    const xhr = new XMLHttpRequest();
    const citiesSort = (a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    };

    xhr.open('GET', url);
    xhr.send();
    xhr.onload = () => {
      resolve(JSON.parse(xhr.response).sort(citiesSort));
    };
    xhr.onerror = () => {
      reject('Не удалось загрузить города');
    }

  });
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
  return full.toUpperCase().includes(chunk.toUpperCase())
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с надписью "Не удалось загрузить города" и кнопкой "Повторить" */
const loadingFailedBlock = homeworkContainer.querySelector('#loading-failed');
/* Кнопка "Повторить" */
const retryButton = homeworkContainer.querySelector('#retry-button');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');
/* Массив с городами */
let cities = [];

const showLoading = () => {
  loadingBlock.style.display = 'block';
  loadingFailedBlock.style.display = 'none';
  retryButton.style.display = 'none';
  filterBlock.style.display = 'none';
};

showLoading();

const loadingFunction = () => {
  showLoading();

  loadTowns()
    .then(
      towns => {
        cities = towns;
        loadingBlock.style.display = 'none';
        filterBlock.style.display = 'block';
        loadingFailedBlock.style.display = 'none';
        retryButton.style.display = 'none';
      },
      () => {
        loadingBlock.style.display = 'none';
        loadingFailedBlock.style.display = 'block';
        retryButton.style.display = 'block';
      }
    );
};

loadingFunction();

retryButton.addEventListener('click', loadingFunction);

filterInput.addEventListener('input', function (e) {
  filterResult.innerHTML = '';
  const search = this.value;
  if (search.trim().length === 0) {
    return false;
  }
  console.log('event');
  const fragment = new DocumentFragment();


  cities.forEach(city => {
    if (isMatching(city.name, search)) {
      const cityItem = document.createElement('li');
      cityItem.textContent = city.name;
      fragment.appendChild(cityItem);
    }
  });

  filterResult.appendChild(fragment);
});

export { loadTowns, isMatching };
