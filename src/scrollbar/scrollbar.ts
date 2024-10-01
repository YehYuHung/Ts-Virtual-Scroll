export interface VirtualScrollOptions {
  container: HTMLElement;
  itemHeight: number;
  totalItems: number;
  bufferSize: number;
  displayNums: number;
}

export class VirtualScroll {
  private container: HTMLElement;
  private scrollableDiv!: HTMLElement;
  private itemHeight: number;
  private totalItems: number;
  private bufferSize: number;
  private displayNums: number;
  private totalHeight: number;
  private items: HTMLElement[] = [];
  private scrollTop: number = 0;

  constructor(options: VirtualScrollOptions) {
    this.container = options.container;
    this.itemHeight = options.itemHeight;
    this.totalItems = options.totalItems;
    this.bufferSize = options.bufferSize;

    this.displayNums = Math.ceil(
      this.container.clientHeight / this.itemHeight
    );
    this.totalHeight = this.totalItems * this.itemHeight;

    this.initScrollableDiv();
    this.initItems();
    this.attachScrollListener();
  }

  // 初始化可滾動內層
  private initScrollableDiv() {
    this.scrollableDiv = document.createElement("div");
    this.scrollableDiv.style.position = "relative";
    this.scrollableDiv.style.height = `${this.totalHeight}px`;
    this.scrollableDiv.style.overflow = "hidden";

    this.container.style.overflowY = "scroll"; // 使 container 可以滾動
    this.container.appendChild(this.scrollableDiv);
  }

  private initItems() {
    for (let i = 0; i < this.displayNums + this.bufferSize; i++) {
      const item = document.createElement("div");
      item.style.height = `${this.itemHeight}px`;
      this.items.push(item);
      this.scrollableDiv.appendChild(item); // 將項目加入 scrollableDiv
    }
    this.renderItems();
  }

  private renderItems() {
    const firstVisibleItemIndex = Math.floor(this.scrollTop / this.itemHeight);
    this.items.forEach((item, index) => {
      const dataIndex = firstVisibleItemIndex + index;
      if (dataIndex < this.totalItems) {
        item.textContent = `Item ${dataIndex}`;
      }
    });
  }

  private attachScrollListener() {
    this.container.addEventListener("scroll", () => {
      this.scrollTop = this.container.scrollTop;
      this.renderItems();
    });
  }
}
