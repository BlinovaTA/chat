export default class Client {
  constructor(url, onMessage) {
    this.url = url;
    this.onMessage = onMessage;
  }

  connect() {
    return new Promise((resolve) => {
      this.socket = new WebSocket(this.url);
      this.socket.addEventListener('open', resolve);

      this.socket.addEventListener('message', (e) => {
        this.onMessage(JSON.parse(e.data));
      });
    });
  }

  login(name, nick) {
    this.sendMessage({ type: 'login', name, nick });
  }

  sendTextMessage(name, nick, message) {
    this.sendMessage({ type: 'message', name, nick, message });
  }

  loadPhoto(photo, nick) {
    this.sendMessage({ type: 'photo', photo, nick });
  }

  sendMessage(data) {
    this.socket.send(JSON.stringify(data));
  }
}