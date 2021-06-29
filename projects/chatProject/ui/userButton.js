export default class UserButton {
  constructor(element, onClick, onPhoto) {
    this.element = element;
    this.onClick = onClick;
    this.ononPhoto = onPhoto;

    this.element.addEventListener('click', onClick);
  }
}
