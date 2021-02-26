import auth from '../templates/auth.hbs';

export default class Auth {
  constructor(container, onClick) {
    container.innerHTML = auth;

    const submitButton = document.querySelector('.auth__submit');
    submitButton.addEventListener('click', authSubmitClick);

    function authSubmitClick() {
      const nameElement = document.querySelector('#name');
      const name = nameElement.value.trim();

      nameElement.classList.remove('auth__input--error');

      if (!name) {
        nameElement.classList.add('auth__input--error');
      }

      const nickElement = document.querySelector('#nick');
      const nick = nickElement.value.trim();

      nickElement.classList.remove('auth__input--error');

      if (!nick) {
        nickElement.classList.add('auth__input--error');
      }

      if (name && nick) {
        onClick({
          type: 'login',
          name: name,
          nick: nick
        });
      }
    }
  }
}
