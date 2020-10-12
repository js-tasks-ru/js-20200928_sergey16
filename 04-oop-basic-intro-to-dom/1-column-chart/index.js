export default class ColumnChart {
element;//html element
	constructor(set){
		//инициализация переменных
		if (this.hasOwnProperty('data'))this.data = set.data;
		else this.data = [];
		if (this.hasOwnProperty('label'))this.label = set.label;
		else this.label = "";
		if (this.hasOwnProperty('value'))this.value = set.value;
		else this.value = 0;
		if (this.hasOwnProperty('link'))this.link = set.link;
		else this.link = "";
		//вызов функций в конструкторе
		this.render();
	}
	render(){
		let skeleton = "";
		//проверка на пустые данные
		if (this.data.length>0 ) skeleton =`"background:;"`;
		else skeleton = `"background: url('charts-skeleton.svg') center no-repeat;"`;	
		//Функция что делает набор строк по массиву
		function strSet(arr){
		let str ="";
		arr.forEach(function(item) {
							str += `<div style="--value: ${item}/100*50" data-tooltip="${item/100*50}%"></div>`
							}); 
		return str;	
		}
		//задание диф элемента
		const div = document.createElement('div');
			//наполняем данными
			div.innerHTML = `
				<div class="dashboard__chart_${this.label}">
					<div class="column-chart" style=`+skeleton+`}>
						<div class="column-chart__title">
							Total ${this.label}
							<a href="/${this.link}" class="column-chart__link">View all</a>
						</div>
						<div class="column-chart__container">
							<div data-element="header" class="column-chart__header">${this.value}</div> 
								<div data-element="body" class="column-chart__chart">
							` +
							strSet(this.data);
							+
							`
							</div>
						</div>
					</div>
				</div>				
			`;
		this.element=div;
	}
	remove(){
		this.element.remove();
	}
	destroy(){
		this.remove();
	}
}
