import Dragger from './dragger';
import UsersList from './usersList';
import Api from './api';

export default class App {
  constructor() {
    this.dragger = new Dragger(
      this.dragStartHandler.bind(this),
      this.dragOverHandler.bind(this),
      this.dropHandler.bind(this)
    );

    this.friendsList = new UsersList(
      document.querySelector('#friends-list'),
      document.querySelector('#user-template')
    );
    this.bestFriendsList = new UsersList(
      document.querySelector('#best-friends-list'),
      document.querySelector('#best-user-template')
    );

    this.friendsInput = document.querySelector('[data-id="friends"]');
    this.friendsInput.addEventListener('input', this.filter.bind(this));
    this.bestFriendsInput = document.querySelector('[data-id="best-friends"]');
    this.bestFriendsInput.addEventListener('input', this.filter.bind(this));

    this.appElement = document.querySelector('#app');

    this.appElement.addEventListener('click', this.clickMove.bind(this));

    (async () => {
      const data = await new Api();
      this.data = data.items;
      this.friendsList.setList(this.data);
    })();
  }

  clickMove(e) {
    const target = e.target;

    if (target.classList.contains('friend__action')) {
      const list = target.closest('.friends__list').id;
      const element = target.closest('.friend');
      const [user] = this.getDataByElement(element);

      if (list === 'best-friends-list') {
        this.moveFriend(user, element, target, 'to-friends');
      } else {
        this.moveFriend(user, element, target);
      }
    }
  }

  moveFriend(user, element, button, type = '') {
    if (type === 'to-friends') {
      button.textContent = '>';
      button.classList.remove('friend__action--theme-cancel');
      this.friendsList.addUser(user, element);
      this.bestFriendsList.deleteUser(user);
    } else {
      button.textContent = 'X';
      button.classList.add('friend__action--theme-cancel');
      this.bestFriendsList.addUser(user, element);
      this.friendsList.deleteUser(user);
    }
  }

  dragStartHandler(e) {
    const zone = this.dragger.getCurrentZone(e.target);

    if (zone) {
      this.dragger.currentDrag = {
        startZone: zone,
        node: e.target,
      };
      e.dataTransfer.setData('text/html', 'dragstart');
    }
  }

  dragOverHandler(e) {
    const zone = this.dragger.getCurrentZone(e.target);

    if (zone) {
      e.preventDefault();
    }
  }

  dropHandler(e) {
    e.preventDefault();
    const zone = this.dragger.getCurrentZone(e.target);
    const user = user;

    if (this.dragger.currentDrag) {
      if (zone && this.dragger.currentDrag.startZone !== zone) {
        this.dragger.droppedZone = zone;
        this.afterDrop(this.dragger.currentDrag.node);
      }

      this.dragger.currentDrag = null;
    }
  }

  afterDrop(element) {
    const button = element.querySelector('.friend__action');
    const [user] = this.getDataByElement(element);

    if (this.dragger.droppedZone.id === 'friends-list') {
      this.moveFriend(user, element, button, 'to-friends');
    } else {
      this.moveFriend(user, element, button);
    }
  }

  getDataByElement(element) {
    const userId = parseInt(element.dataset.friend);
    return this.data.filter((element) => element.id === userId);
  }

  filter(e) {
    const input = e.target;

    if (input.dataset.id === 'friends') {
      this.friendsList.filter(this.friendsInput.value);
    }
    if (input.dataset.id === 'best-friends') {
      this.bestFriendsList.filter(this.bestFriendsInput.value);
    }
  }
}
