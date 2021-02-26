
export default class Modal {
  constructor(loadPhoto) {
    this.loadPhoto = loadPhoto;
    const header = document.querySelector('.left__header');

    let self = this;

    header.addEventListener('click', (e) => {
      const modal = document.querySelector('.modal');
      modal.style.display = 'flex';

      const closeModal = document.querySelector('.modal__close');
      closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
      }, { once: true });

      const buttonCancel = document.querySelector('.button__cancel');
      buttonCancel.addEventListener('click', () => {
        self.loadPhoto('./src/img/default-photo.svg');
        modal.style.display = 'none';
      });

      const buttonLoad = document.querySelector('.button__load');
      buttonLoad.addEventListener('click', () => {
        let input = document.createElement('input');
        input.type = 'file';

        input.addEventListener("change", (e) => {
          const file = e.target.files[0];

          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);

          fileReader.onload = function () {
            const { result } = fileReader;
            self.loadPhoto(result);
          };
        });

        input.click();
      });
    });
  }
}
