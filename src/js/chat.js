import Client from './client';
import Auth from './auth';
import Users from './users';
import Messages from './messages';
import Modal from './modal';
import Handlebars from 'handlebars';
import chat from '../templates/chat.hbs';

export default class Chat {
  constructor() {
    this.container = document.querySelector('.container');
    this.ws = new Client(
      'ws://localhost:5501',
      this.onMessage.bind(this)
    );

    this.auth = new Auth(
      this.container,
      this.onAuthSubmit.bind(this)
    );
  }

  async onAuthSubmit(response) {
    let { name, nick } = response;

    await this.ws.connect();
    this.ws.login(name, nick);
  }

  sendTextMessage(message) {
    this.ws.sendTextMessage(this.name, this.nick, message);
    this.messages.clear();
  }

  loadPhoto(photo) {
    this.ws.loadPhoto(photo, this.nick);
  }

  onMessage(response) {
    const { name, id, type, message, allUsers, time, photo, nick } = response;

    switch (type) {
      case 'login': {
        const chatCompile = Handlebars.compile(chat);
        this.container.innerHTML = chatCompile({
          name: name,
          nick: nick,
          photo: photo
        });

        let self = this;

        document.addEventListener('drop', function (e) {
          if (!e.target.classList.contains('current-user__img')) {
            return;
          }

          let droppedFiles = e.dataTransfer.files;

          if (droppedFiles.length > 0) {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(droppedFiles[0]);

            fileReader.onload = function () {
              const { result } = fileReader;

              self.loadPhoto(result);
            };
          }
        });

        this.users = new Users(allUsers);
        this.messages = new Messages(this.sendTextMessage.bind(this));
        this.modal = new Modal(this.loadPhoto.bind(this));
        this.name = name;
        this.nick = nick;

        break;
      }

      case 'users': {
        this.users.add({ name, nick, photo });
        this.messages.addInfo(`${name} вошёл в чат`);

        break;
      }

      case 'logout': {
        this.users.remove({ name });
        this.messages.addInfo(`${name} вышел из чатa`);

        break;
      }

      case 'message': {
        this.messages.add({ name, nick, message, time, photo });

        break;
      }

      case 'photo': {
        let items = document.querySelectorAll(`#${nick}`);
        items.forEach(item => item.src = photo);

        break;
      }
    }
  }
}
