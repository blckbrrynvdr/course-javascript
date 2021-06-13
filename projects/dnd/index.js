/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';

const homeworkContainer = document.querySelector('#app');

document.addEventListener('mousemove', (e) => {});

let draggDiv;

const setPosition = (element, x, y) => {
  element.style.left = x;
  element.style.top = y;
};

document.addEventListener('dragstart', (e) => {
  draggDiv = {
    element: e.target,
    offsetX: e.offsetX,
    offsetY: e.offsetY,
  };
});
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  setPosition(
    draggDiv.element,
    `${e.clientX - draggDiv.offsetX}px`,
    `${e.clientY - draggDiv.offsetY}px`
  );
});
document.addEventListener('drop', (e) => {
  setPosition(
    draggDiv.element,
    `${e.clientX - draggDiv.offsetX}px`,
    `${e.clientY - draggDiv.offsetY}px`
  );
});

export function createDiv() {
  const div = document.createElement('div');
  const randomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  /* Добавляем класс и разрешаем таскать*/
  div.classList = 'draggable-div';
  div.draggable = true;
  /* Устанавливаем случайный размер */
  div.style.height = `${randomNumber(100, 500)}px`;
  div.style.width = `${randomNumber(100, 500)}px`;
  /* Красим в случайный цвет */
  div.style.backgroundColor = `rgb(
    ${randomNumber(0, 255)},
    ${randomNumber(0, 255)},
    ${randomNumber(0, 255)}
  )`;
  /* Закидываем в рандомное место на экране */
  div.style.top = `${randomNumber(0, window.innerHeight)}px`;
  div.style.left = `${randomNumber(0, window.innerWidth)}px`;

  return div;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const div = createDiv();
  homeworkContainer.appendChild(div);
});
