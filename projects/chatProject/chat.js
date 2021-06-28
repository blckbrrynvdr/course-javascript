import ChatWindow from './ui/chatWindow';
import LoginWindow from './ui/loginWindow';
import UserWindow from './ui/userWindow';

export default class Chat {
  constructor() {
    this.ui = {
      loginWindow: new LoginWindow(
        document.querySelector('#login'),
        this.onLogin.bind(this)
      ),
      chatWindow: new ChatWindow(document.querySelector('#main')),
      user: new UserWindow(document.querySelector('#user')),
    };

    this.ui.loginWindow.show();
  }

  onLogin(name) {
    this.ui.loginWindow.hide();
    this.ui.chatWindow.show();
    this.ui.user.setName(name);
  }
}
