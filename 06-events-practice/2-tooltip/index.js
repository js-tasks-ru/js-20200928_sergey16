class Tooltip {

  element; //html
  static inst;

  constructor() {
    if (Tooltip.inst) {//если есть возвращаем
      return Tooltip.inst;
    }
    Tooltip.inst = this;
  }
  render(html) {
    //инициализация
    this.element = document.createElement("div");
    this.element.className = "tooltip";
    this.element.innerHTML = html;

    document.body.append(this.element);
  }
  initEvent() {
    document.addEventListener("pointerover", this.mouseOver);
    document.addEventListener("pointerout", this.mouseOut);
  }
  initialize() {
    this.initEvent();
  }
  mouseOver = event => {
    const elem = event.target.closest(`[data-tooltip]`);//определение где нажали
    if (elem) {//если есть там тултип
      this.render(elem.dataset.tooltip);
      this.moveTT(event);

      document.addEventListener("pointermove", this.mouseMove);
    }
  }
  mouseOut = () => {
    this.deleteTT();
  }
  mouseMove = event => {
    this.moveTT(event);
  }
  deleteTT() {
    if (this.element) {
      this.element.remove();
      this.element = null;

      document.removeEventListener("pointermove", this.mouseMove);//чистим обработчик событий
    }
  }
  moveTT(event) {
    const xpos = event.clientX + 10;//x смещение чтобы не залезать на сам тултип
    const ypos = event.clientY + 10;//y смещение чтобы не залезать на сам тултип

    this.element.style.left = `${xpos}px`;
    this.element.style.top = `${ypos}px`;
  }
  //удаление тултипа
  destroy() {
    document.removeEventListener("pointerover", this.mouseOver);//чистим обработчик событий
    document.removeEventListener("pointerout", this.mouseOut);//чистим обработчик событий
    this.deleteTT();
  }
}

const tooltip = new Tooltip();

export default tooltip;
