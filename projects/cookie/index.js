/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

/* При загрузке страницы сразу пытаемся рендерить куки */
window.addEventListener('DOMContentLoaded', () => {
  renderCookiesList();
});

/* При вводе в поле фильтра перерисовываем таблицу с учетом фильтра */
filterNameInput.addEventListener('input', function () {
  renderCookiesList(this.value);
});

/* При добавлении новой куки устанавливаем куку, перерисовываем таблицу в соответствии с фильтром*/
addButton.addEventListener('click', () => {
  setCookie(addNameInput.value, addValueInput.value);
  renderCookiesList(filterNameInput.value);
});

/**
 *  Функция отрисовки таблицы.
 *  @param {data} string строка для поиска в имени или в значении куки
 *
 */
function renderCookiesList(data = '') {
  /* Сначала удаляем содержимое таблицы*/
  listTable.innerHTML = '';
  /* Отфильтровываем список кук и отрисовываем подходящие */
  filterCookies(data).forEach((element) => {
    createTableLine(element);
  });
}
/**
 *  Функция создания DOM элементов для таблицы
 *  @param {data} object объект с данными о куке
 *
 */
function createTableLine(data) {
  const line = document.createElement('tr');
  const name = document.createElement('td');
  const value = document.createElement('td');
  const deleteCell = document.createElement('td');
  const deleteBtn = document.createElement('button');

  name.textContent = data.name;
  value.textContent = data.value;
  deleteBtn.textContent = 'X';
  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    line.remove();
    deleteCookie(data.name);
  });
  deleteCell.append(deleteBtn);
  line.append(name, value, deleteBtn);
  listTable.append(line);
}
/**
 *  Фильтрация кук
 *  @param {fragment} string Строка по которой будет происходить фильтрация (частичное совпадение)
 *  @return {array} отфильтрованный массив объектов кук
 */
function filterCookies(fragment = '') {
  return getCookiesList().filter((element) => {
    if (element?.name.includes(fragment) || element?.value.includes(fragment)) {
      return element;
    }
  });
}
/**
 *  Получение кук
 *  @return {array} массив объектов кук
 */
function getCookiesList() {
  return document.cookie.split('; ').map((element) => {
    const [name, value] = element.split('=');
    if (name.length > 0) {
      return {
        name: name,
        value: value,
      };
    }
  });
}
/**
 *  Установка кук
 *  @param {name} string имя куки
 *  @param {value} string значение куки
 *  @param {options} object дополнительные параметры
 *  @return {object} объект с данными куки
 */
function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options,
  };

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey;
    const optionValue = options[optionKey];

    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;

  return {
    name: name,
    value: value,
  };
}
/**
 *  Удаление куки
 *  @param {name} string имя куки
 *  @return {void} отрабатывает и ничего не возвращает. Жмотина а не функция
 */
function deleteCookie(name) {
  setCookie(name, '', {
    'max-age': -1,
  });
}
