import Handlebars from 'handlebars';

export default class UsersList {
  constructor(element, template) {
    this.element = element;
    this.users = [];
    this.template = template;
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

    const template = this.template.textContent;
    const render = Handlebars.compile(template);

    this.element.innerHTML = render(elements);
  }
}
