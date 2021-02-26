const WebSocket = require('ws');
const dayjs = require('dayjs');

class Server {
  constructor(port) {
    this.wss = new WebSocket.Server({ port: port });
    this.users = [];

    this.wss.on('connection', function connection(ws) {

      let currentNick;

      ws.on('message', function messageHandler(e) {
        const request = JSON.parse(e);

        switch (request.type) {
          case 'login': {
            currentNick = this.login(ws, request);

            break;
          }

          case 'message': {
            this.sendMessageToEveryone(request);

            break;
          }

          case 'photo': {
            this.sendPhotoToEveryone(request);

            break;
          }

          default: {
            break;
          }
        }
      }.bind(this));

      ws.on('close', function closeHandler(e) {
        this.users.forEach(item => {
          if (item.connection !== null) {
            item.connection.send(JSON.stringify({
              type: 'logout',
              name: this.users.find(item => item.nick === currentNick).name
            }))
          }
        })

        this.setUsers(this.users.map(item => {
          if (item.nick === currentNick) {
            item.connection = null;
          }

          return item;
        }));
      }.bind(this));
    }.bind(this));
  }

  login(ws, request) {
    let user = this.getCurrentUser(ws, request);

    ws.send(JSON.stringify({
      type: 'login',
      name: user.name,
      nick: user.nick,
      photo: user.photo,
      allUsers: this.getAllUsers()
    }));

    this.sendNameToEveryone(user.nick, user.name, user.photo);

    return user.nick;
  }

  getCurrentUser(ws, request) {
    let { name, nick } = request.data;

    let user = this.users.find(item => item.nick === nick);

    if (user !== undefined) {
      this.setUsers(this.users.map(item => {
        if (item.nick === nick) {
          item.connection = ws;
        }

        return item;
      }));

    } else {
      user = {
        connection: ws,
        name: name,
        nick: nick,
        photo: './src/img/default-photo.svg'
      };

      this.users.push(user);
    }

    return user;
  }

  sendNameToEveryone(nick, name, photo) {
    this.users.forEach(item => {
      if ((nick !== item.nick) && (item.connection !== null)) {
        item.connection.send(JSON.stringify({
          type: 'users',
          name: name,
          nick: nick,
          photo: photo
        }));
      }
    });
  }

  sendMessageToEveryone(request) {
    const { message, name, nick } = request.data;

    let user = this.users.find(item => item.nick === nick);

    const data = {
      type: 'message',
      message: message,
      name: name,
      nick: nick,
      time: dayjs().format('HH:mm'),
      photo: user.photo
    };

    this.users.forEach(item => item.connection.send(JSON.stringify(data)));
  }

  sendPhotoToEveryone(request) {
    let { photo, nick } = request;

    let user = this.users.find(item => item.nick === nick);

    user.photo = photo;

    this.users.forEach(item => item.connection.send(JSON.stringify({
      type: 'photo',
      nick: nick,
      photo: photo
    })));
  }

  setUsers(users) {
    this.users = users;
  }

  getAllUsers() {
    return this.users.reduce((prev, item) => {
      if (item.connection !== null) {
        prev.push({
          name: item.name,
          nick: item.nick,
          photo: item.photo
        });
      }

      return prev;
    }, [])
  }
}

new Server('5501');