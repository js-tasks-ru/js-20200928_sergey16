export default class ColumnChart {
element;//html element
	constructor(set){
		//инициализация переменных
		this.data = set.data;
		this.label = set.label;
		this.value = set.value;
		this.link = set.link;
		//вызов функций в конструкторе
		this.render();
	}
	render(){
		//Функция что делает набор строк по массиву
		function strSet(arr){
		let str ="";
		//проверка на пустые данные
		if (arr!==[] && arr!==undefined){

		arr.forEach(function(item) {
							str += `<div style="--value: ${item}" data-tooltip="${item/100*50}%"></div>`
							}); 
		}
		else str =`<img src="charts-skeleton.svg" height="100%" width="100%">`; 
		return str;	
		}
		//задание диф элемента
		const div = document.createElement('div');
			//наполняем данными
			div.innerHTML = `
				<div class="dashboard__chart_${this.label}">
					<div class="column-chart">
						<div class="column-chart__title">
							Total ${this.label}
							<a href="/${this.label}" class="column-chart__link">View all</a>
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
