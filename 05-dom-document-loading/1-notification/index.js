export default class NotificationMessage {
element;
	constructor(notification,{
		duration = 0,
		type = ""
	} = {}){
			//инициализация переменных
			this.note =	notification;
			this.dur = duration;
			this.type = type;
			//вызов функций в конструкторе
	}
  get element() {
    return this.element.join();
  }
	render(){
		//задание див элемента
		this.element = document.createElement('div');
    this.element.innerHTML = `
				<div class="notification ${this.type}" style="--value:${this.dur}s">
					<div class="timer"></div>
					<div class="inner-wrapper">
						<div class="notification-header">${this.type}</div>
						<div class="notification-body">
						${this.note}
					</div>
				</div>
			`;
		this.element = this.element.firstElementChild;
		document.body.append(this.element);
		setTimeout(() => element.remove(), this.dur);

	}
	show(){
		this.render();
	}
	//удаление элемента
	remove(){
		this.element.remove();
	}

	destroy(){
		this.remove();
	}
}
