export default class UserPhoto {
  constructor(element, onUpload, onSavePhoto) {
    this.element = element;
    this.onUpload = onUpload;
    this.onSavePhoto = onSavePhoto;
    this.closeBtn = element.querySelector('.user-foto__cancel');
    this.saveBtn = element.querySelector('.user-foto__save');
    this.photoInput = element.querySelector('#avatar-input');
    this.photoLabel = element.querySelector('.user-foto__avatar-label');
    this.photoImg = element.querySelector('.user-foto__avatar-image');
    this.photoData = '';
    this.name = '';

    this.closeBtn.addEventListener('click', this.hide.bind(this));

    this.photoInput.addEventListener('input', (e) => {
      const [file] = this.photoInput.files;
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.addEventListener('load', () => {
        this.photoData = reader.result;
        return this.onUpload(reader.result);
      });
    });

    this.saveBtn.addEventListener('click', () => {
      this.onSavePhoto(this.photoData);
      this.hide();
    });
  }

  set(photo) {
    this.photoImg.src = photo;
    this.photoImg.dataset.userPhoto = this.name;
  }

  setName(name) {
    this.name = name;
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
