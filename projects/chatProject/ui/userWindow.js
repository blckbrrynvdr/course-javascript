export default class UserWindow {
  constructor(element, onPhoto) {
    this.element = element;
    this.nameElement = element.querySelector('.user-popup__name');
    this.closeElement = element.querySelector('.user-popup__close');
    this.photoBtn = element.querySelector('.user-popup__avatar-box');
    this.photo = element.querySelector('#avatar-image');
    this.onPhoto = onPhoto;

    this.closeElement.addEventListener('click', this.hide.bind(this));
    this.photoBtn.addEventListener('click', this.onPhoto);
  }

  setName(name) {
    this.name = name;
    this.nameElement.textContent = name;
    this.photo.dataset.userPhoto = name;
    this.photo.src = `/chatProject/ws/photos/${name}.png?t=${Date.now()}`;
  }

  getName() {
    return this.name;
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
