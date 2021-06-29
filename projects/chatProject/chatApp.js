import ChatWindow from './ui/chatWindow';
import LoginWindow from './ui/loginWindow';
import UserWindow from './ui/userWindow';
import MessageList from './ui/messageList';
import UserList from './ui/userList';
import MessageSender from './ui/messageSender';
import WSClient from './wsClient';

export default class ChatApp {
  constructor() {
    this.wsClient = new WSClient(
      `ws://${location.host}/chatApp/ws`,
      this.onMessage.bind(this)
    );

    this.ui = {
      loginWindow: new LoginWindow(
        document.querySelector('#login'),
        this.onLogin.bind(this)
      ),
      chatWindow: new ChatWindow(document.querySelector('#main')),
      userWindow: new UserWindow(document.querySelector('#user')),
      userList: new UserList(document.querySelector('#users-list')),
      messageList: new MessageList(document.querySelector('#message-list')),
      messageSender: new MessageSender(
        document.querySelector('#message-sender'),
        this.onSend.bind(this)
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
  }

  onMessage({ type, from, data }) {
    console.log(type, from, data);

    if (type === 'hello') {
      this.ui.userList.add(from);
      this.ui.messageList.addSystemMessage(`${from} вошел в чат`);
    }
    if (type === 'user-list') {
      for (const item of data) {
        this.ui.userList.add(item);
      }
    }
    if (type === 'close-connect') {
      this.ui.userList.remove(from);
      this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
    }
    if (type === 'text-message') {
      this.ui.messageList.add(from, data.message);
    }
  }
}
