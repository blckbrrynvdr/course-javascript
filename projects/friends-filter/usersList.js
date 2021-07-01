import Handlebars from 'handlebars';

export default class UsersList {
  constructor(element) {
    this.element = element;
    this.users = [];
    // this.onChange = onChange;

    // this.filterInput = document.querySelector('[data-id="friends"]');
    // this.filterInput.addEventListener('input', () => {

    // })
  }

  addUser(user, element) {
    this.users.push(user);
    this.element.append(element);
  }

  setList(users) {
    this.users = users;

    this.render({ items: this.users });
  }

  deleteUser(user) {
    this.users = this.users.filter((item) => user.id !== item.id);
  }

  filter(userName) {
    const filteredFriends = this.users.filter((element) => {
      if (
        element.first_name.toLowerCase().includes(userName.toLowerCase()) ||
        element.last_name.toLowerCase().includes(userName.toLowerCase())
      ) {
        return true;
      }
    });

    this.render({ items: filteredFriends });
  }

  render(elements) {
    this.element.innerHTML = '';

    const template = document.querySelector('#user-template').textContent;
    const render = Handlebars.compile(template);
    const html = render(elements);

    this.element.innerHTML = html;
  }
}
