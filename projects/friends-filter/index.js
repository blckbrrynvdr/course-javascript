import './index.html';
import './styles.css';
import App from './app';

// function init() {
//     return new Promise(resolve => {
//         window.vkAsyncInit = function() {
//             VK.init({
//               apiId: 7893039
//             });
//             resolve();
//           };

//           setTimeout(function() {
//             var el = document.createElement("script");
//             el.type = "text/javascript";
//             el.src = "https://vk.com/js/api/openapi.js?169";
//             el.async = true;
//             document.getElementById("vk_api_transport").appendChild(el);
//           }, 0);

//     });
// }

// init().then(() => {
//     console.log('vk', VK);
// })

// window.addEventListener('DOMContentLoaded', function () {
//   const prom = initDoc();
//   // prom.then(() => (const api = new Api()))
// });

// const api = new Api();
window.addEventListener('DOMContentLoaded', () => {
  new App();
});

document.addEventListener('click', function (e) {
  const target = e.target;

  if (e.target.classList.contains('friend__action')) {
    console.log('target!', target);
  }
});
