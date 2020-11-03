export default class SortableTable {

  //стартовая инициализация
  element;//html
  subElements = {};
  headConf =[];
  data =[];

  constructor (headConf, {
    data = [],
    sorted = {
      id: headConf.find(item=>item.sortable).id,
      order: "asc"
    }
  } = {}) {

    //инициализация переменных
    this.data =	data;
    this.headConf = headConf;
    this.sorted = sorted;

    //вызов функций в конструкторе
    this.render();

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

  render() {
    const {id, order} = this.sorted;
    const elem = document.createElement("div");
    const sortedData = this.sortData(id, order);
    elem.innerHTML = this.getTab(sortedData);
    const element = elem.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);

    this.initEvent();//нажатие для сортировки
  }
  initEvent() {
    this.subElements.header.addEventListener("click", this.onSortClick);
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
      const sortedData = this.sortData(id, sw(order));
      const arrow = column.querySelector(".sortable-table__sort-arrow");
      column.dataset.order = sw(order);
      if (!arrow) {//вставляем анимацию стрелки если ее нет
        column.append(this.subElements.arrow);
      }
      this.subElements.body.innerHTML = this.getRowsTab(sortedData);//сортировка по выбранной колонке
    }
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
  //удаление элемента
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
