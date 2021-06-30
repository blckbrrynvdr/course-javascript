export default class ChatWindow {
  constructor(element) {
    this.element = element;
    this.usersCount = 0;
    this.usersCountElement = element.querySelector('.chat__users-count');
  }

  setUsersCount(count) {
    this.usersCount = count;
    this.usersCountElement.textContent = count;
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
