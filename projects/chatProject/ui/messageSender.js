export default class MessageSender {
  constructor(element, onSend) {
    this.onSend = onSend;
    this.messageInput = element.querySelector('#message-input');
    this.messageSendButton = element.querySelector('#message-send');

    this.messageSendButton.addEventListener('click', (e) => {
      e.preventDefault();

      const message = this.messageInput.value.trim();

      if (message) {
        this.onSend(message);
      }
    });
  }

  clear() {
    this.messageInput.value = '';
  }
}
