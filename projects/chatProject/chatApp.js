import ChatWindow from './ui/chatWindow';
import LoginWindow from './ui/loginWindow';
import UserWindow from './ui/userWindow';
import UserButton from './ui/userButton';
import UserPhoto from './ui/userPhoto';
import MessageList from './ui/messageList';
import UserList from './ui/userList';
import MessageSender from './ui/messageSender';
import WSClient from './wsClient';
console.log(`ws://${location.host}/chatProject/ws`);
export default class ChatApp {
  constructor() {
    this.wsClient = new WSClient(
      `ws://localhost:8181/chatProject/ws`,
      this.onMessage.bind(this)
    );

    this.ui = {
      loginWindow: new LoginWindow(
        document.querySelector('#login'),
        this.onLogin.bind(this)
      ),
      chatWindow: new ChatWindow(document.querySelector('#main')),
      userWindow: new UserWindow(
        document.querySelector('#user'),
        this.onPhoto.bind(this)
      ),
      userList: new UserList(document.querySelector('#users-list')),
      messageList: new MessageList(document.querySelector('#message-list')),
      messageSender: new MessageSender(
        document.querySelector('#message-sender'),
        this.onSend.bind(this)
      ),
      userButton: new UserButton(
        document.querySelector('#user-button'),
        this.onClick.bind(this)
      ),
      userPhoto: new UserPhoto(
        document.querySelector('#user-photo'),
        this.onUpload.bind(this)
      ),
    };

    this.ui.loginWindow.show();
  }

  onSend(message) {
    this.wsClient.sendTextMessage(message);
    this.ui.messageSender.clear();
  }

  async onLogin(name) {
    await this.wsClient.connect();
    this.wsClient.sendHello(name);
    this.ui.loginWindow.hide();
    this.ui.chatWindow.show();
    this.ui.userWindow.setName(name);
    this.ui.userPhoto.setName(name);
    this.ui.userPhoto.set(`/chatProject/ws/photos/${name}.png?t=${Date.now()}`);
    this.updatePhotos();
  }

  updatePhotos() {
    const avatars = document.querySelectorAll(`[data-user-photo`);
    for (const avatar of avatars) {
      const user = avatar.dataset.userPhoto;
      avatar.src = `/chatProject/ws/photos/${user}.png?t=${Date.now()}`;
    }
  }

  onMessage({ type, from, data }) {
    console.log('onMessage type', type);
    console.log('onMessage from', from);
    console.log('onMessage data', data);

    if (type === 'hello') {
      this.ui.userList.add(from);
      this.ui.messageList.addSystemMessage(`${from} вошел в чат`);
      this.updatePhotos();
    }
    if (type === 'user-list') {
      for (const item of data) {
        this.ui.userList.add(item);
      }
      this.updatePhotos();
    }
    if (type === 'close-connect') {
      this.ui.userList.remove(from);
      this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
      this.updatePhotos();
    }
    if (type === 'text-message') {
      this.ui.messageList.add(from, data.message);
    }
    if (type === 'photo-changed') {
      const avatars = document.querySelectorAll(`[data-user-photo="${data.name}"]`);

      for (const avatar of avatars) {
        avatar.src = `/chatProject/ws/photos/${data.name}.png?t=${Date.now()}`;
      }
    }
  }

  onUpload(data) {
    this.ui.userPhoto.set(data);
    fetch('/chatProject/ws/upload-photo', {
      method: 'post',
      body: JSON.stringify({
        name: this.ui.userWindow.getName(),
        image: data,
      }),
    });
  }

  onClick() {
    this.ui.userWindow.show();
  }

  onPhoto() {
    this.ui.userPhoto.show();
  }
}
