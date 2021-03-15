import userItem from '../templates/user-item.hbs';
import Handlebars from 'handlebars';

export default class Users {
  constructor(items) {
    this.items = items;
    this.build();
  }

  createLI(data) {
    let li = document.createElement('li');

    const userItemCompile = Handlebars.compile(userItem);
    li.innerHTML = userItemCompile(data);

    return li;
  }

  build() {
    let usersElement = document.querySelector('.users__list');
    let title = document.querySelector('.users__title');

    title.textContent = `Участники (${this.items.length})`;

    usersElement.innerHTML = '';

    const fragment = document.createDocumentFragment();

    this.items.forEach((item) => {
      fragment.append(this.createLI(item));
    });

    usersElement.append(fragment);
  }

  add(data) {
    this.items.push(data);
    this.build();
  }

  remove(data) {
    this.items.splice(this.items.indexOf(data), 1);
    this.build();
  }
}
