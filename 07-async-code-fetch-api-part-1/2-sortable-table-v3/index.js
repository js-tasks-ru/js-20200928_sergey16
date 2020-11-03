import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {

  //стартовая инициализация
  element;//html
  subElements = {};
  headConf =[];//уже нет
  data =[];
  loading = false;//флаг ограничивающий постоянное пролистывание
  start = 1;
  step = 20;
  end = this.start + this.step;

  constructor (headConf = [], {
    url = "",
    sorted = {
      id: headConf.find(item=>item.sortable).id,
      order: "asc"
    },
    isSortLocal = false,
    start = 1,
    step = 20,
    end = start + step
  } = {}) {

    //инициализация переменных
    this.url =	new URL(url, BACKEND_URL);
    this.headConf = headConf;
    this.sorted = sorted;
    this.isSortLocal = isSortLocal;
    this.start = start;
    this.end = end;
    this.step = step;

    //вызов функций в конструкторе
    this.render().then();

  }

  onWindowScroll = async() => { //пролистывание с подгрузкой данных

    const {bottom} = this.element.getBoundingClientRect();
    const {id, order} = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocal) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true; //выставляем флаг активным

      const data = await this.loadData(id, order, this.start, this.end);
      this.update(data);
      this.loading = false; // когда закончили обнуляем флаг
    }
  }



  getRowsHead({id, title, sortable}) {
    const order = this.sorted.id === id ? this.sorted.order : "asc"; //либо сортировка по клику либо стартовая сортировка по дефолту
    return `<div class="sortable-table__cell"  data-id="${id}" data-sortable="${sortable}" data-order="${order}">
                <span>${title}</span>
                ${this.getHeadSortArrow(id)}
            </div>`;
  }
  getHeadSortArrow(id) {
    const orderExit = this.sorted.id === id ? this.sorted.order : '';
    return orderExit ? `<span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>` : '';
  }

  getTabHead() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headConf.map(item => this.getRowsHead(item)).join("")}
            </div>`;
  }

  getTabBody() {
    return `<div data-element="body" class="sortable-table__body">
                    ${this.getRowsTab(this.data)}
                </div>`;
  }
  getRowsTab(data) {
    return data.map(item => {
      return `<a href="/products/${item.id}" class="sortable-table__row">${this.getRowTab(item)}</a>`;
    }).join("");
  }
  getRowTab(item) {
    const cell = this.headConf.map(({id, template}) => {
      return {
        id,
        template
      };
    });
    return cell.map(({id, template}) => {
      return template ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join("");
  }

  getTab() {
    return `<div class="sortable-table">
                ${this.getTabHead()}
                ${this.getTabBody()}
            </div>`;
  }

  async render() {
    const {id, order} = this.sorted;
    const elem = document.createElement("div");
    const sortedData = this.sortData(id, order);
    elem.innerHTML = this.getTab(sortedData);
    const element = elem.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);

    const data = await this.loadData(id, order, this.start, this.end);

    this.renderRows(data);
    this.initEvent();//нажатие для сортировки
  }
  async loadData (id, order, start = this.start, end = this.end) {

    //загрузка параметров
    this.url.searchParams.set("_sort", id);
    this.url.searchParams.set("_order", order);
    this.url.searchParams.set("_start", start);
    this.url.searchParams.set("_end", end);

    this.element.classList.add("sortable-table_loading");

    const data = await fetchJson(this.url);

    this.element.classList.remove("sortable-table_loading");
    return data;
  }

  initEvent() {
    this.subElements.header.addEventListener("pointerdown", this.onSortClick);
    document.addEventListener('scroll', this.onWindowScroll);
  }
  onSortClick = event => {
    const column = event.target.closest(`[data-sortable="true"]`);//определение на какой колонке нажали
    const sw = order => {//переключатель сортировки
      const orders = {
        asc: "desc",
        desc: "asc"
      };
      return orders[order];
    };
    if (column) {
      const {id, order} = column.dataset;
      const newOrder = sw(order);
      const arrow = column.querySelector(".sortable-table__sort-arrow");
      column.dataset.order = sw(order);
      if (!arrow) {//вставляем анимацию стрелки если ее нет
        column.append(this.subElements.arrow);
      }
      if (this.isSortLocal) {
        this.sortLocal(id, newOrder);
      } else {
        this.sortOnServer(id, newOrder, 1, 1 + this.step).then();
      }
    }
  }
  sortLocal(id, order) {
    const sortedData = this.sortData(id, order);

    this.subElements.body.innerHTML = this.getRowsTab(sortedData);//сортировка по выбранной колонке
  }
  renderRows(data) {
    if (data.length) {
      this.element.classList.remove('sortable-table_empty');
      this.addRows(data);
    } else {
      this.element.classList.add('sortable-table_empty');
    }
  }
  addRows(data) {
    this.data = data;

    this.subElements.body.innerHTML = this.getRowsTab(data);
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll(`.sortable-table__cell[data-id]`);
    const curColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);
    allColumns.forEach(column =>{
      column.dataset.order = "";
    });
    curColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getRowsTab(sortedData);
  }
  async sortOnServer(id, order, start, end) {
    const data = await this.loadData(id, order, start, end);

    this.renderRows(data);
  }
  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headConf.find(item => item.id === field);
    const {sortType} = column;
    const dir = order === "asc" ? 1 : -1;

    return arr.sort((a, b)=>{
      switch (sortType) {
      case "number":
        return dir * (a[field] - b[field]);
      case "string":
        return dir * a[field].localeCompare(b[field], "ru");
      default:
        return dir * (a[field] - b[field]);
      }
    });
  }
  getSubElements(element) {
    const elem = element.querySelectorAll("[data-element]");
    return [...elem].reduce((acc, subElements) => {
      acc[subElements.dataset.element] = subElements;
      return acc;
    }, {});
  }
  //обновление данных
  update(data) {
    const rows = document.createElement("div");
    this.data = [...this.data, ...data];
    rows.innerHTML = this.getRowsTab(data);
    this.subElements.body.append(...rows.childNodes);
  }

  //удаление элемента
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
