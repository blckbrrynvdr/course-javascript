export default class UserList {
  constructor(element) {
    this.element = element;
    this.items = new Set();
  }

  render() {
    const fragment = document.createDocumentFragment();

    this.element.innerHTML = '';

    for (const name of this.items) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = document.querySelector('#user-item').innerHTML;
      const item = wrapper.querySelector('.common-user');
      const userName = wrapper.querySelector('.common-user__name');
      const avatar = wrapper.querySelector('.user-avatar__pic');

      userName.textContent = name;
      avatar.setAttribute('data-user-photo', name);
      avatar.src = `/chatProject/ws/photos/${name}.png?t=${Date.now()}`;

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
