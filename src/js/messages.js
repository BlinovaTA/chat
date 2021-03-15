import messageItem from '../templates/message.hbs';
import Handlebars from 'handlebars';

export default class Messages {
  constructor(sendMessage) {
    this.sendMessage = sendMessage;

    this.messageElement = document.querySelector('.right__messages');
    this.messageText = document.querySelector('.message__text');
    this.messageSubmit = document.querySelector('.message__submit');

    this.messageSubmit.addEventListener('click', () => {
      this.send();
    });

    this.messageText.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.send();
      }
    });
  }

  send() {
    const message = this.messageText.value.trim();

    if (message) {
      this.sendMessage(message);
    }
  }

  add(data) {
    const li = document.createElement('li');

    const messageItemCompile = Handlebars.compile(messageItem);
    li.innerHTML = messageItemCompile(data);

    this.messageElement.append(li);
    this.messageElement.scrollTop = this.messageElement.scrollHeight;
  }

  addInfo(message) {
    const li = document.createElement('li');
    li.className = 'message__info';
    li.textContent = message;

    this.messageElement.append(li);
    this.messageElement.scrollTop = this.messageElement.scrollHeight;
  }

  clear() {
    this.messageText.value = '';
  }
}
