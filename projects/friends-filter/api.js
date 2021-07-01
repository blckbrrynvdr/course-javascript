const VK = window.VK;

export default class Api {
  constructor() {
    return new Promise((resolve) => {
      this.init()
        .then(() => {
          return this.auth();
        })
        .then(() => {
          resolve(this.getFriends());
        });
    });
  }

  init() {
    return new Promise((resolve) => {
      window.vkAsyncInit = function () {
        VK.init({
          apiId: 7893039,
        });
        resolve();
      };

      setTimeout(function () {
        const el = document.createElement('script');
        el.type = 'text/javascript';
        el.src = 'https://vk.com/js/api/openapi.js?169';
        el.async = true;
        document.getElementById('vk_api_transport').appendChild(el);
      }, 0);
    });
  }

  auth() {
    return new Promise((resolve, reject) => {
      VK.Auth.login((data) => {
        if (data.session) {
          resolve();
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      }, 2);
    });
  }

  callAPI(method, params) {
    params.v = '5.131';

    return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.response);
        }
      });
    });
  }

  async getFriends() {
    try {
      const friends = await this.callAPI('friends.get', {
        fields: 'photo_100',
      });
      return friends;
      // console.log('friedns', friends);
      // const template = document.querySelector('#user-template').textContent;
      // const render = Handlebars.compile(template);
      // const html = render(friends);
      // const results = document.querySelector('#friends-list');

      // results.innerHTML = html;
    } catch (e) {
      console.log(e);
    }
  }

  // getData() {
  //   return this.data;
  // }
}
