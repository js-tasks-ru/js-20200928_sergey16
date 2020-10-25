import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;//уставка высоты барчартов
  constructor({
    label = '',
    link = '',
    formatHeading = data => data,
    url = '',
    range = {from: new Date(), to: new Date()}
  } = {}) {
    //инициализация переменных
    this.url =	new URL(url, BACKEND_URL);
    this.label = label;
    this.range = range;
    this.link = link;
    this.formatHeading = formatHeading;

    //вызов функций в конструкторе
    this.render();
    this.loadData(this.range.from, this.range.to);

  }
  getColBody(data) {
    // задание коэффициэнта
    const maxVal = Math.max(...Object.values(data));

    return Object.entries(data).map(item => {
      const scale = this.chartHeight / maxVal;
      //считаем процент
      const percent = (item / maxVal * 100).toFixed(0); //и округляем
      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
    }).join("");//преобразуем в строку
  }
  getHeaderVal(data) {
    return this.formatHeading(Object.values(data).reduce((acc, item) => (acc + item), 0));
  }
  getSubElement(element) {
    const elem = element.querySelectorAll("[data-element]");
    return [...elem].reduce((acc, subElements) =>{
      acc[subElements.dataset.element] = subElements;
      return acc;
    }, {});
  }

  render() {
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
    // if (this.data.length) {//вычищаем скелетон стоящий по умолчанию
    // this.element.classList.remove(`column-chart_loading`);
    //}
    this.subElements = this.getSubElement(this.element);
  }
  async loadData(from, to) {

    this.element.classList.add("column-chart_loading");
    this.subElements.header.textContent = "";
    this.subElements.body.innerHTML = "";
    this.url.searchParams.set("from", from.toISOString());
    this.url.searchParams.set("to", to.toISOString());

    const data = await fetchJson(this.url);
    this.setNewRange(from, to);

    if (data && Object.values(data).length) {
      this.subElements.header.textContent = this.getHeaderVal(data);
      this.subElements.body.innerHTML = this.getColBody(data);
      this.element.classList.remove("column-chart_loading");
    }
  }

  setNewRange(from, to) {
    this.range.from = from;
    this.range.to = to;
  }

  //обновление при изменении входных данных
  update(data) {
    this.subElements.body.innerHTML = this.getColBody(data);
  }
  //удаление элемента
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
