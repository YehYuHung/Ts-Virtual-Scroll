export interface VirtualScrollItems {
  name: string;
  value?: string;
  hasCheck?: boolean;
}

export interface VirtualScrollOptions {
  container: HTMLElement;
  itemHeight: number;
  viewHeight?: number;
  paddingNode?: number;
  items?: VirtualScrollItems[];
}

export interface VirtualSettings {
  isCheck: Boolean;
}

export class VirtualScroll {
  private container: HTMLElement;
  private scrollpanel!: HTMLElement;
  private itemHeight: number;
  private totalItems: number;
  private viewHeight: number;
  private paddingNode: number;
  private displayNums: number;
  private totalHeight: number;
  private dataItems: VirtualScrollItems[] = [];
  private scrollTop: number = 0;
  private startIndex: number = 0;
  private setting: VirtualSettings;

  constructor(options: VirtualScrollOptions, setting?: VirtualSettings) {
    this.setting = { ...setting, ...VirtualScroll.DefaultSettings };
    this.container = options.container;
    this.itemHeight = options.itemHeight;
    this.dataItems = options.items ?? [];
    this.totalItems = options.items?.length ?? 0;
    this.viewHeight = options.viewHeight ?? 200;
    this.paddingNode = options.paddingNode ?? 1;
    this.totalHeight = this.totalItems * this.itemHeight;
    this.initscrollpanel();

    this.displayNums =
      Math.ceil(this.container.clientHeight / this.itemHeight) +
      2 * this.paddingNode;

    this.renderItems();
  }

  // 初始化可滾動內層
  private initscrollpanel() {
    this.scrollpanel = document.createElement("div");
    this.scrollpanel.style.height = `${this.totalHeight}px`;
    this.scrollpanel.style.overflow = "hidden";
    this.scrollpanel.style.transform = `translate3d(0px, 0px, 0px)`;
    this.scrollpanel.classList.add("mg-vs-inner");

    this.container.style.height = `${this.viewHeight}px`;
    this.container.style.overflow = "auto"; // 使 container 可以滾動
    this.container.appendChild(this.scrollpanel);
    this.attachScrollListener();
  }

  private renderItems() {
    this.emptyScrollDiv();
    const finalNums = this.getFinalNode();
    for (let i = this.startIndex; i < finalNums; i++) {
      const data = this.dataItems[i] ?? {};
      const item = document.createElement("div");
      item.style.height = `${this.itemHeight}px`;
      item.classList.add("mg-item");
      item.textContent = data.name;
      if (data.value) item.setAttribute("value", data.value);
      this.scrollpanel.appendChild(item); // 將項目加入 scrollpanel
    }
  }

  private attachScrollListener() {
    this.container.addEventListener("scroll", () => this.addScrollEvent());
  }

  private addScrollEvent() {
    this.scrollTop = this.container.scrollTop;
    if (this.scrollTop > this.itemHeight) {
      this.startIndex = this.getStartNode();
      const scrollPanelHeight = this.startIndex * this.itemHeight;
      this.scrollpanel.style.transform = `translate3d(0px, ${scrollPanelHeight}px, 0px)`;
      this.scrollpanel.style.height = `${
        this.totalHeight - scrollPanelHeight
      }px`;
      this.renderItems();
    } else {
      this.resetScrollHeight();
    }
  }

  private resetScrollHeight() {
    this.startIndex = 0;
    this.scrollpanel.style.transform = `translate3d(0px, 0px, 0px)`;
    this.scrollpanel.style.height = `${this.totalHeight}px`;
    this.renderItems();
  }

  private getFinalNode() {
    return Math.min(this.startIndex + this.displayNums, this.totalItems);
  }

  private getStartNode() {
    return Math.min(
      Math.floor(this.scrollTop / this.itemHeight),
      this.totalItems - this.displayNums
    );
  }

  private emptyScrollDiv() {
    while (this.scrollpanel.firstElementChild) {
      this.scrollpanel.firstElementChild.remove();
    }
  }

  static DefaultSettings: VirtualSettings = {
    isCheck: false,
  };
}
