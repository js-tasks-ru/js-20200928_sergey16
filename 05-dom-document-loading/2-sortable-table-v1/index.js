export default class SortableTable {

  //стартовая инициализация
  element;//html
  subElements = {};
  headConf =[];
  data =[];

  constructor (headConf, {
    data = []
  } = {}) {

    //инициализация переменных
    this.data =	data;
    this.headConf = headConf;

    //вызов функций в конструкторе
    this.render();
  }
  getRowsHead({id, title, sortable}) {
    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
                <span>${title}</span>
                ${this.getHeadSortArrow()}
            </div>`;
  }
  getHeadSortArrow() { //задел на апгрейд версии сортируемых таблиц
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>`;
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
    const elem = document.createElement("div");
    elem.innerHTML = this.getTab();
    const element = elem.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);
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
    return [...elem].reduce((acc, subElements) =>{
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

