const Controller = window.Controller;

window.Router = {
  handle(route) {
    const routeName = route + 'Route';
    Controller[routeName]();
  },
};
