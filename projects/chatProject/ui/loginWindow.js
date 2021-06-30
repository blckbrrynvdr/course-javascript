export default class LoginWindow {
  constructor(element, onLogin) {
    this.element = element;
    this.onLogin = onLogin;

    const loginInput = element.querySelector('.common-input');
    const loginForm = element.querySelector('.action-box__form');
    const errorField = element.querySelector('.action-box__error');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      errorField.textContent = '';

      const name = loginInput.value.trim();

      if (!name) {
        errorField.textContent = 'Введите никнейм!';
      } else {
        this.onLogin(name);
      }
    });
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
