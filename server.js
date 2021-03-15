const WebSocket = require('ws');
const dayjs = require('dayjs');

class Server {
  constructor(port) {
    this.wss = new WebSocket.Server({ port: port });
    this.users = [];

    this.wss.on('connection', function connection(ws) {

      let currentUser;

      ws.on('message', function messageHandler(e) {
        const request = JSON.parse(e);

        switch (request.type) {
          case 'login': {
            currentUser = this.getCurrentUser(ws, request);

            this.login(ws, currentUser);
            this.sendNameToOthers(currentUser);

            break;
          }

          case 'message': {
            this.sendDataToAll(request);

            break;
          }

          case 'photo': {
            this.sendDataToAll(request);

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
              name: this.users.find(item => item.nick === currentUser.nick).name
            }))
          }
        })

        this.setUsers(this.users.map(item => {
          if (item.nick === currentUser.nick) {
            item.connection = null;
          }

          return item;
        }));
      }.bind(this));
    }.bind(this));
  }

  login(ws, user) {
    ws.send(JSON.stringify({
      type: 'login',
      name: user.name,
      nick: user.nick,
      photo: user.photo,
      allUsers: this.getAllUsers()
    }));
  }

  getCurrentUser(ws, request) {
    let { name, nick } = request;

    let user = this.users.find(item => item.nick === nick);
    let newUser = user === undefined;

    if (newUser) {
      user = {
        name,
        nick,
        photo: './src/img/default-photo.svg'
      };
    }

    let currentUser = { ...user };
    user.connection = ws;

    if (newUser) {
      this.users.push(user);
    }

    return currentUser;
  }

  sendNameToOthers(user) {
    this.users.forEach(item => {
      if ((user.nick !== item.nick) && (item.connection !== null)) {
        user.type = 'users';

        item.connection.send(JSON.stringify(user));
      }
    });
  }

  sendDataToAll(request) {
    let user = this.users.find(item => item.nick === request.nick);
    let data = this.buildData(request, user);

    this.users.forEach(item => item.connection !== null && item.connection.send(JSON.stringify(data)));
  }

  buildData(request, user) {
    switch (request.type) {
      case 'message': {
        request.time = dayjs().format('HH:mm');
        request.photo = user.photo;

        break;
      }

      case 'photo': {
        user.photo = request.photo;

        break;
      }

      default:
        break;
    }

    return request;
  }

  setUsers(users) {
    this.users = users;
  }

  getAllUsers() {
    return this.users.filter(item => item.connection !== null);
  }
}

new Server('5501');