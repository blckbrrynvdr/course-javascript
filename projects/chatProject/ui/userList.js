export default class UserList {
  constructor(element) {
    this.element = element;
    this.items = new Set();
  }

  // ex buildDOM()
  render() {
    const fragment = document.createDocumentFragment();

    this.element.innerHtml = '';

    for (const name of this.items) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = document.querySelector('#user-item').innerHTML;
      const item = wrapper.querySelector('.common-user');
      const userName = wrapper.querySelector('.common-user__name');
      userName.textContent = name;

      fragment.append(item);
    }

    this.element.append(fragment);
  }

  add(name) {
    this.items.add(name);
    this.render();
  }

  remove(name) {
    this.items.delete(name);
    this.render();
  }
}
