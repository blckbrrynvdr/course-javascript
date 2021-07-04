export default class Dragger {
  constructor(onDragStart, onDragOver, onDrop) {
    this.currentDrag;
    this.droppedZone;
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
  }

  getCurrentZone(from) {
    do {
      if (from.classList.contains('friends__list')) {
        return from;
      }
    } while ((from = from.parentElement));

    return null;
  }
}
