export interface VirtualScrollOptions {
  container: HTMLElement;
  itemHeight: number;
  totalItems: number;
  viewHeight?: number;
  paddingNode?: number;
}

export class VirtualScroll {
  private container: HTMLElement;
  private scrollableDiv!: HTMLElement;
  private itemHeight: number;
  private totalItems: number;
  private viewHeight: number;
  private paddingNode: number;
  private displayNums: number;
  private totalHeight: number;
  private items: HTMLElement[] = [];
  private scrollTop: number = 0;
  private startIndex: number = 0;

  constructor(options: VirtualScrollOptions) {
    this.container = options.container;
    this.itemHeight = options.itemHeight;
    this.totalItems = options.totalItems;
    this.viewHeight = options.viewHeight ?? 200;
    this.paddingNode = options.paddingNode ?? 1;
    this.totalHeight = this.totalItems * this.itemHeight;
    this.initScrollableDiv();

    this.displayNums = Math.ceil(this.container.clientHeight / this.itemHeight) + 2 * this.paddingNode;

    this.renderItems();
  }

  // 初始化可滾動內層
  private initScrollableDiv() {
    this.scrollableDiv = document.createElement("div");
    this.scrollableDiv.style.height = `${this.totalHeight}px`;
    this.scrollableDiv.style.overflow = "hidden";
    this.scrollableDiv.style.transform = `translate3d(0px, 0px, 0px)`;

    this.container.style.height = `${this.viewHeight}px`;
    this.container.style.overflow = "auto"; // 使 container 可以滾動
    this.container.appendChild(this.scrollableDiv);
    this.attachScrollListener();
  }

  private renderItems() {
    this.emptyScrollDiv();
    const finalNums = this.getFinalNode();
    for (let i = this.startIndex; i < finalNums; i++) {
      const item = document.createElement("div");
      item.style.height = `${this.itemHeight}px`;
      item.textContent = `Item ${i}`;
      this.items.push(item);
      this.scrollableDiv.appendChild(item); // 將項目加入 scrollableDiv
    }
  }

  private attachScrollListener() {
    this.container.addEventListener("scroll", () => this.addScrollEvent());
  }

  private addScrollEvent() {
    this.scrollTop = this.container.scrollTop;
    if(this.scrollTop > this.itemHeight){
      this.startIndex = this.getStartNode();
      const scrollPanelHeight = this.startIndex * this.itemHeight;
      this.scrollableDiv.style.transform = `translate3d(0px, ${scrollPanelHeight}px, 0px)`;
      this.scrollableDiv.style.height = `${this.totalHeight - scrollPanelHeight}px`;
      this.renderItems();
    }
    else {
      this.resetScrollHeight();
    }
  }

  private resetScrollHeight() {
    this.startIndex = 0;
    this.scrollableDiv.style.transform = `translate3d(0px, 0px, 0px)`;
    this.scrollableDiv.style.height = `${this.totalHeight}px`;
    this.renderItems();
  }

  private getFinalNode() {
    return Math.min(this.startIndex + this.displayNums, this.totalItems);
  }

  private getStartNode() {
    return Math.min(Math.floor(this.scrollTop / this.itemHeight),this.totalItems - this.displayNums);
  }

  private emptyScrollDiv(){
    while (this.scrollableDiv.firstElementChild) {
      this.scrollableDiv.firstElementChild.remove();
    }
  }  
}
