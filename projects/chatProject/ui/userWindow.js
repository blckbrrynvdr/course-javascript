export default class UserWindow {
  constructor(element) {
    this.element = element;
    this.nameElement = element.querySelector('.user-popup__name');
  }

  setName(name) {
    this.name = name;
    this.nameElement.textContent = name;
  }

  getName() {
    return this.name;
  }
}
