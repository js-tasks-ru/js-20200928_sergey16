export default class ColumnChart {
	subElements = {};
	chartHeight = 50;//уставка высоты барчартов

	constructor({
		data = [],
		label = '',
		link = '',
		value = 0
	} = {}){
			//инициализация переменных
			this.data =	data;
			this.label = label;
			this.value = value;
			this.link = link;
			//вызов функций в конструкторе
			this.render();
	}
	getColBody(data){
		// задание коэффициэнта
		const maxVal = Math.max(...data);
		const scale = this.chartHeight/maxVal;
		return data.map(item => {
			//считаем процент
			const percent = (item / maxVal * 100).toFixed(0); //и округляем
			return `<div style="--value: ${Math.floor(item*scale)}" data-tooltip="${percent}%"></div>`;
		}).join("");//преобразуем в строку
	}
	getSubElement(element){
		const elem =element.querySelectorAll("[data-element]");
		return [...elem].reduce((acc,subElements) =>{
			acc[subElements.dataset.element]=subElements;
			return acc
		},{});
		}

	render(){
		//задание див элемента
		const element = document.createElement('div');
		element.innerHTML = `
				<div class="column-chart column-chart_loading" style="...${this.chartHeight}">
					<div class="column-chart__title">
						Total ${this.label}
						<a href="/${this.link}" class="column-chart__link">View all</a>
					</div>
					<div class="column-chart__container">
						<div data-element="header" class="column-chart__header">${this.value}</div>
						<div data-element="body" class="column-chart__chart">
							${this.getColBody(this.data)}
						</div>
					</div>
				</div>
			`;
		this.element = element.firstElementChild;
		if (this.data.length){//вычищаем скелетон стоящий по умолчанию
			this.element.classList.remove(`column-chart_loading`);
		}
		this.subElements = this.getSubElement(this.element);
	}
	//обновление при изменении входных данных
	update(data){
	this.subElements.body.innerHTML = this.getColBody(data);
	}
	//удаление элемента
	remove(){
		this.element.remove();
	}
	destroy(){
		this.remove();
	}
}
