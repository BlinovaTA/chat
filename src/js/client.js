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
    this.sendMessage('login', { name: name, nick: nick });
  }

  sendTextMessage(name, nick, message) {
    this.sendMessage('message', { name: name, nick: nick, message: message });
  }

  loadPhoto(photo, nick) {
    this.socket.send(
      JSON.stringify({
        type: 'photo',
        photo: photo,
        nick: nick
      })
    );
  }

  sendMessage(type, data) {
    this.socket.send(
      JSON.stringify({
        type: type,
        data: data,
      })
    );
  }
}