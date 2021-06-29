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
      // const time = format(new Date(), 'kk:mm');
      const wrapper = document.createElement('div');
      wrapper.innerHTML = document.querySelector('#message-box');
      const messageBox = wrapper.querySelector('.message-box');
      const avatar = wrapper.querySelector('.user-avatar__pic');
      const name = wrapper.querySelector('.message-box__author-name');
      // const messageText = wrapper.querySelector('.message__text');
      // const messageTime = wrapper.querySelector('.message__time');

      messageBox.dataset.user = from;

      name.textContent = sanitize(from);
      // messageText.textContent = sanitize(text);
      // messageTime.textContent = time;
      avatar.src = sanitize(from);

      this.element.append(wrapper.innerHTML);

      this.addToExisting(from, text);

      this.setLastUser(from);
    }
  }

  addToExisting(from, text) {
    const time = format(new Date(), 'kk:mm');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = document.querySelector('#message');
    const messageItem = wrapper.querySelector('.message');
    const targetMessageBox = document.querySelector(`[data-user=${from}]`);
    const textBox = wrapper.querySelector('.message__text');
    const timeBox = wrapper.querySelector('.message__time');

    messageItem.classList.add('.message-box__item');
    textBox.textContent = text;
    timeBox.textContent = time;

    targetMessageBox.append(messageItem);
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
    wrapper.innerHTML = document.querySelector('#system-message');
    const messageElement = wrapper.querySelector('.system-message');

    messageElement.textContent = message;

    this.element.append(messageElement);
    this.element.scrollTop = this.element.scrollHeight;
  }
}
