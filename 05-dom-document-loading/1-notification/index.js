export default class NotificationMessage {

static ActiveNote;

constructor(notification, {
  duration = 0,
  type = ""
} = {}) {
  //инициализация переменных
  this.note =	notification;
  this.duration = duration;
  this.type = type;
  this.durSec = duration / 1000 + "s";
  //проверка на флаг
  if (NotificationMessage.ActiveNote) {
    NotificationMessage.ActiveNote.remove();
  }
  //вызов функций в конструкторе
  this.render();
}
render() {
  //задание див элемента
  const element = document.createElement('div');
  element.innerHTML = `
				<div class="notification ${this.type}" style="--value:${this.durSec}">
					<div class="timer"></div>
					<div class="inner-wrapper">
						<div class="notification-header">${this.type}</div>
						<div class="notification-body">
						${this.note}
					</div>
				</div>
			`;
  this.element = element.firstElementChild;
  NotificationMessage.ActiveNote = this.element;



}
show(parent = document.body) {
  parent.append(this.element);
  setTimeout(() => this.remove(), this.duration);//таймер
}

//удаление элемента
remove() {
  this.element.remove();
}

destroy() {
  this.remove();
  NotificationMessage.ActiveNote = null;
}
}
