import '../sass/main.scss';
import Chat from './chat';

new Chat();

window.addEventListener('load', function () {
  ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
    document.addEventListener(event, function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
  });
});