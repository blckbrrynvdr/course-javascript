export default class UserPhoto {
  constructor(element, onUpload) {
    this.element = element;
    this.closeBtn = element.querySelector('.user-foto__cancel');
    this.saveBtn = element.querySelector('.user-foto__save');
    this.photoInput = element.querySelector('#avatar-input');
    this.photoLabel = element.querySelector('.user-foto__avatar-label');
    this.photoImg = element.querySelector('.user-foto__avatar-image');
    this.onUpload = onUpload;
    this.name = '';

    this.closeBtn.addEventListener('click', this.hide.bind(this));

    this.photoInput.addEventListener('input', (e) => {
      console.log('photo input');
      const [file] = this.photoInput.files;
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.addEventListener('load', () => this.onUpload(reader.result));
    });
  }

  set(photo) {
    this.photoImg.src = photo;
    this.photoImg.dataset.userPhoto = this.name;
  }

  setName(name) {
    this.name = name;
  }

  showUserPhoto() {
    this.photoLabel.classList.add('hidden');
    this.photoImg.classList.remove('hidden');
  }

  showPhotoInput() {
    this.photoLabel.classList.remove('hidden');
    this.photoImg.classList.add('hidden');
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
