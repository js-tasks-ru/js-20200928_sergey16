export default class DoubleSlider {

  element; //html
  thumbLeft;//левый слайдер
  thumbRight;//правый слайдер
  leftShiftX;//смещение левого слайдера  по X
  rightShiftX;//смещение правого слайдера  по X

  constructor({
    min = 0,
    max = 0,
    formatValue = []
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    //вызов функций в конструкторе
    this.render();

  }

  render() {
    //инициализация
    this.element = document.createElement("div");
    this.element.innerHTML = this.getBody();
    this.thumbLeft = this.element.querySelector('.range-slider__thumb-left');
    this.thumbRight = this.element.querySelector('.range-slider__thumb-right');
    this.thumbProgress = this.element.querySelector('.range-slider__progress');

    this.initEvent();//нажатие
  }

  getBody() {
    return `<div class="range-slider">
                <span>${this.formatValue(this.min)}</span>
                <div class="range-slider__inner">
                     ${this.getProgressSlider()}
                     ${this.getLeftSlider()}
                     ${this.getRightSlider()}
                </div>
                <span>${this.formatValue(this.max)}</span>
            </div>`;
  }

  getProgressSlider() {
    return `<span class="range-slider__progress" style="left: ${this.leftShiftX}; right: ${this.rightShiftX}"></span>`;
  }

  getLeftSlider() {
    return `<span class="range-slider__thumb-left" style="left: ${this.leftShiftX}"></span>`;
  }

  getRightSlider() {
    return `<span class="range-slider__thumb-right" style="${this.rightShiftX}"></span>`;
  }

  initEvent() {
    document.addEventListener('mousedown', this.onMouseDown);
    //document.addEventListener('mousedown', this.onDragStart);
  }
  onMouseDown = event => {
    event.preventDefault(); // предотвратить запуск выделения (действие браузера)

    this.leftShiftX = event.clientX - this.thumbLeft.getBoundingClientRect().left;
    //this.rightShiftX = event.clientX - this.thumbRight.getBoundingClientRect().right;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    console.log(this.leftShiftX);
  }
  onMouseMove = event => {
    let newLeft = event.clientX - this.leftShiftX - this.element.getBoundingClientRect().left;
    //let newLeftMax = event.clientX - this.rightShiftX - this.element.getBoundingClientRect().right;
    // курсор вышел из слайдера => оставить бегунок в его границах.
    if (newLeft < this.min) {
      newLeft = 0;
    }
    let rightEdge = this.element.offsetWidth - this.thumbLeft.offsetWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }
    this.thumbLeft.style.left = newLeft + 'px';
    //this.thumbRight.style.right = newLeftMax + 'px';
    this.thumbProgress.style.left = newLeft + 'px';
   // this.thumbProgress.style.right = this.rightShiftX + 'px';
  }

  onMouseUp = () => {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }
  onDragStart = () =>{
    return false;
  }

}

