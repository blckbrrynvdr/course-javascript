import { sanitize } from '../utils';
import { format } from 'date-fns';

export default class MessageList {
  constructor(element) {
    this.element = element;
    this.lastUser = null;
  }

  add(from, text) {
    if (this.isFromTheLastUser(from)) {
      this.addToExisting(from, text);
    } else {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = document.querySelector('#message-box').innerHTML;
      const messageBox = wrapper.querySelector('.message-box');
      const avatar = wrapper.querySelector('.user-avatar__pic');
      const name = wrapper.querySelector('.message-box__author-name');

      messageBox.dataset.user = from;
      name.textContent = sanitize(from);
      avatar.setAttribute('data-user-photo', from);
      avatar.src = `/chatProject/ws/photos/${from}.png?t=${Date.now()}`;

      this.element.append(messageBox);

      this.addToExisting(from, text);

      this.setLastUser(from);
    }
  }

  addToExisting(from, text) {
    const time = format(new Date(), 'kk:mm');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = document.querySelector('#message').innerHTML;
    const messageItem = wrapper.querySelector('.message');
    let targetMessageBox = document.querySelectorAll(`[data-user="${from}"]`);
    targetMessageBox = targetMessageBox[targetMessageBox.length - 1];
    const targetMessageList = targetMessageBox.querySelector('.message-box__list');
    const textBox = wrapper.querySelector('.message__text');
    const timeBox = wrapper.querySelector('.message__time');

    messageItem.classList.add('message-box__item');
    textBox.textContent = text;
    timeBox.textContent = time;

    targetMessageList.append(messageItem);
    this.element.scrollTop = this.element.scrollHeight;
  }

  setLastUser(from) {
    this.lastUser = from;
  }

  isFromTheLastUser(from) {
    return this.lastUser === from;
  }

  addSystemMessage(message) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = document.querySelector('#system-message').innerHTML;
    const messageElement = wrapper.querySelector('.system-message');

    messageElement.textContent = message;

    this.element.append(messageElement);
    this.element.scrollTop = this.element.scrollHeight;
  }
}
