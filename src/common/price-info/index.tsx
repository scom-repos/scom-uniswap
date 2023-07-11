import { customElements, Module, ControlElement, Label, Icon, Container, Styles, VStack, HStack, Panel } from '@ijstech/components';
import { borderStyle } from './priceInfo.css';
const Theme = Styles.Theme.ThemeVars;

interface IPriceInfo {
  isBorderShown?: boolean;
  rate: string;
  networkFee: string;
  routing: string;
  detail: { title: string; value: string; tooltip?: string }[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-uniswap-price-info']: ControlElement;
    }
  }
};

@customElements('i-scom-uniswap-price-info')
export class PriceInfo extends Module {
  private lbRate: Label;
  private lbNetworkFee: Label;
  private iconDetail: Icon;
  private iconArrow: Icon;
  private vStackDetail: VStack;
  private vStackInfo: VStack;
  private lbRouting: Label;
  private hStackRouting: HStack;
  private hStackCollapse: HStack;
  private pnlDivider: Panel;

  private _items: IPriceInfo;
  private _isBorderShown: boolean = true;
  toggleRate: () => void;
  private isInitialized: boolean;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  get items(): IPriceInfo {
    return this._items;
  }

  set items(value: IPriceInfo) {
    this._items = value;
    this.renderItems();
  }

  get isBorderShown() {
    return this._isBorderShown;
  }

  set isBorderShown(value: boolean) {
    this._isBorderShown = value;
    this.updateBorder();
  }

  private renderItems = () => {
    if (!this.isInitialized) return;
    const { rate, networkFee, routing, detail } = this.items;
    if (!rate) {
      this.visible = false;
      return;
    }
    this.visible = true;
    this.lbRate.caption = rate;
    this.lbNetworkFee.caption = networkFee;
    this.lbRouting.caption = routing;
    const nodeItems: Element[] = [];
    for (const item of detail) {
      nodeItems.push(<i-hstack gap={10}>
        <i-label caption={item.title} tooltip={{ content: item.tooltip }} />
        <i-label caption={item.value} display="flex" margin={{ left: 'auto' }} />
      </i-hstack>)
    }
    this.vStackInfo.clearInnerHTML();
    this.vStackInfo.append(...nodeItems);
  }

  private onCollapse = () => {
    const visible = this.vStackDetail.visible;
    this.iconArrow.name = visible ? 'angle-down' : 'angle-up';
    this.lbNetworkFee.visible = visible;
    this.iconDetail.visible = visible;
    this.vStackDetail.visible = !visible;
  }

  private updateBorder = () => {
    if (!this.isInitialized) return;
    if (this.isBorderShown) {
      this.hStackCollapse.visible = true;
      this.hStackRouting.visible = true;
      this.pnlDivider.visible = true;
      this.firstElementChild.classList.add(borderStyle);
    } else {
      this.vStackDetail.visible = true;
      this.hStackCollapse.visible = false;
      this.hStackRouting.visible = false;
      this.pnlDivider.visible = false;
      this.firstElementChild.classList.remove(borderStyle);
    }
  }

  private onToggleRate = () => {
    if (this.toggleRate) this.toggleRate();
  }

  init() {
    super.init();
    this.isInitialized = true;
    if (this.items) this.renderItems();
    this.updateBorder();
  }

  render() {
    return (
      <i-vstack width="100%">
        <i-hstack id="hStackCollapse" gap={10} wrap="wrap" verticalAlignment="center" class="pointer" onClick={this.onCollapse}>
          <i-label id="lbRate" onClick={this.onToggleRate} />
          <i-hstack gap={4} margin={{ left: 'auto' }} horizontalAlignment="end" verticalAlignment="center">
            <i-icon id="iconDetail" name="gas-pump" opacity={0.6} width={16} height={16} fill={Theme.text.primary} />
            <i-label id="lbNetworkFee" opacity={0.6} />
            <i-icon id="iconArrow" name="angle-down" opacity={0.6} width={24} height={24} fill={Theme.text.primary} />
          </i-hstack>
        </i-hstack>
        <i-vstack id="vStackDetail" visible={false} gap={10} verticalAlignment="center">
          <i-panel id="pnlDivider" width="100%" height={2} margin={{ top: 10 }} background={{ color: Theme.input.background }} />
          <i-vstack id="vStackInfo" gap={10} verticalAlignment="center" />
          <i-hstack id="hStackRouting" gap={10} verticalAlignment="center" wrap="wrap">
            <i-panel width="100%" height={2} background={{ color: Theme.input.background }} />
            <i-label caption="Order routing" />
            <i-label id="lbRouting" caption="-" margin={{ left: 'auto' }} />
          </i-hstack>
        </i-vstack>
      </i-vstack>
    )
  }
}