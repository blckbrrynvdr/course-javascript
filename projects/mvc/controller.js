const Model = window.Model;
const View = window.View;

window.Controller = {
  async friendsRoute() {
    const results = document.querySelector('#results');
    const friends = await Model.getFriends({ fields: 'photo_100' });
    results.innerHTML = View.render('friends', { list: friends.items });
  },
  async newsRoute() {
    const results = document.querySelector('#results');
    const news = await Model.getNews({ filters: 'post', count: 20 });
    results.innerHTML = View.render('news', { list: news.items });
  },
};
