import {
  customElements,
  customModule,
  Module,
  Container,
  ControlElement,
  Modal,
  Panel,
  Input,
  Label,
  Icon,
  Switch,
  IEventBus,
  observable,
  application,
  Button,
  Control,
  VStack,
  Checkbox,
  Styles
} from '@ijstech/components';
import { EventId } from '../../global/index';
import { getSlippageTolerance, getTransactionDeadline, isRouterAuto, setAPIOrClient, setSlippageTolerance, setTransactionDeadline, toggleRouter } from '../../store/index';
import styleClass from './index.css';

const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-uniswap-transaction-settings']: ControlElement;
    }
  }
};

const listSlippage = [0.1, 0.5, 1];

@customModule
@customElements('i-scom-uniswap-transaction-settings')
export class TransactionSettings extends Module {
  private transactionModal: Modal;
  private slippageGroup: Panel;
  private slippageInput: Input;
  private deadlineInput: Input;
  private deadlineGroup: Panel;
  private deadlineMessage: Label;
  private warningIcon: Icon;
  private switchRouter: Switch;
  private vStackOptions: VStack;
  private chbAPI: Checkbox;
  private chbClient: Checkbox;

  private $eventBus: IEventBus;
  @observable()
  private slippageToleranceMessage: string;
  routerChanged: () => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.$eventBus = application.EventBus;
  }

  private async onRenderSlippage() {
    listSlippage.map(async value => {
      const button = await Button.create({
        height: 'auto',
        width: '4rem',
        caption: `${value}%`
      });
      button.classList.add('pill-slippage');
      button.onClick = (source: Control) => this.onSelectSlippage(source, value);
      this.slippageGroup.prepend(button);
    })

    const label = await Label.create();
    label.caption = '%';
    this.slippageInput.appendChild(label);
  }

  private async onRenderWarningElm() {
    this.deadlineMessage = await Label.create();
    this.deadlineMessage.caption = 'Please enter a valid transaction deadline';
    this.deadlineMessage.classList.add("slippage-message");

    this.warningIcon = await Icon.create();
    this.warningIcon.fill = '#f05e61';
    this.warningIcon.width = 15.75;
    this.warningIcon.height = 14;
    this.warningIcon.name = 'exclamation-triangle';
    this.warningIcon.classList.add('slippage-input__warning');
  }

  private onActiveItem = (source: Control) => {
    const activeItem = this.slippageGroup.querySelector('.active');
    if (activeItem) {
      if (source.isSameNode(activeItem)) return;
      activeItem.classList.remove('active');
    }

    source.classList.add('active');
  }

  private onSelectSlippage = (source: Control, val: any) => {
    this.inputSlippageTolerance(source, val);
    if (listSlippage.includes(val)) {
      this.slippageInput.value = '';
    }
  }

  private inputSlippageTolerance = (source: Control, val: any) => {
    if (val) {
      const value = +val;
      const hasWarningIcon = this.slippageInput.contains(this.warningIcon);
      this.slippageInput.value = value;
      this.slippageInput.placeholder = value.toFixed(2)
      if (value < 50) {
        setSlippageTolerance(value);
        this.$eventBus.dispatch(EventId.SlippageToleranceChanged);
        this.setSlippageToleranceMessage();
        this.slippageInput.classList.remove('transaction-input__error');
        if (value > 5) {
          if (!hasWarningIcon)
            this.slippageInput.prepend(this.warningIcon);
        } else if (hasWarningIcon)
          this.slippageInput.removeChild(this.warningIcon);
      } else {
        this.slippageToleranceMessage = 'Please enter a valid slippage percentage';
        this.slippageInput.classList.add('transaction-input__error');
        if (hasWarningIcon)
          this.slippageInput.removeChild(this.warningIcon);
      }
    }
    const index = listSlippage.indexOf(+val);
    if (index >= 0 && source.isSameNode(this.slippageInput)) {
      const buttons = this.slippageGroup.querySelectorAll('i-button.pill-slippage');
      this.onActiveItem(buttons[index] as Button)
    } else {
      this.onActiveItem(source);
    }
  }

  private blurSlippageTolerance = (source: Input) => {
    const val = source.value;
    if (val && val >= 50) {
      this.inputSlippageTolerance(source, 0.5);
    } else if (!this.slippageInput.value) {
      this.inputSlippageTolerance(source, getSlippageTolerance());
    }
  }

  private setSlippageToleranceMessage = () => {
    const slippageTolerance = getSlippageTolerance();
    if (slippageTolerance < 0.5) {
      return (this.slippageToleranceMessage = 'Your transaction may fail');
    } else if (slippageTolerance >= 0.5 && slippageTolerance <= 5) {
      return (this.slippageToleranceMessage = '');
    } else if (slippageTolerance > 5 && slippageTolerance < 50) {
      return (this.slippageToleranceMessage = 'Your transaction may be frontrun');
    } else {
      return (this.slippageToleranceMessage = 'Please enter a valid slippage percentage');
    }
  }

  private inputDeadline = (source: Control, event: Event) => {
    const val = (source as Input).value;
    setTransactionDeadline(+val);
    const hasMessage = this.deadlineGroup.contains(this.deadlineMessage)
    if (val > 180) {
      this.deadlineInput.classList.add('transaction-input__error');
      if (!hasMessage)
        this.deadlineGroup.appendChild(this.deadlineMessage);
    } else {
      this.deadlineInput.classList.remove('transaction-input__error');
      if (hasMessage)
        this.deadlineGroup.removeChild(this.deadlineMessage);
    }
  }

  private blurTransactionDeadline = (source: Input) => {
    const val = source.value;
    const newVal = val > 180 || val < 1 ? 30 : parseInt(val);
    source.value = newVal;
    setTransactionDeadline(newVal);
    if (val > 180 && this.deadlineGroup.contains(this.deadlineMessage)) {
      this.deadlineGroup.removeChild(this.deadlineMessage);
    }
    this.deadlineInput.classList.remove('transaction-input__error');
  }

  private toggleRouterAuto = () => {
    toggleRouter();
    this.vStackOptions.visible = !isRouterAuto();
    this.switchRouter.checked = isRouterAuto();
    if (this.routerChanged) this.routerChanged();
  }

  private checkAPIOrClient = (isAPI: boolean = false) => {
    this.chbAPI.checked = isAPI;
    this.chbClient.checked = !isAPI;
    setAPIOrClient(isAPI);
    if (this.routerChanged) this.routerChanged();
  }

  private setDefaultTransactionSettings() {
    const slippageTolerance = getSlippageTolerance();
    const index = listSlippage.indexOf(slippageTolerance);
    if (index >= 0) {
      const buttons = this.slippageGroup.querySelectorAll('i-button.pill-slippage');
      this.onActiveItem(buttons[index] as Button)
      this.slippageInput.value = '';
    } else {
      this.slippageInput.value = slippageTolerance;
      this.onActiveItem(this.slippageInput)
    }
    this.slippageInput.placeholder = slippageTolerance.toFixed(2);

    const transactionDeadline = getTransactionDeadline();
    this.deadlineInput.value = transactionDeadline;
  }

  async init() {
    this.classList.add(styleClass);
    super.init();
    await this.onRenderSlippage();
    await this.onRenderWarningElm();
    this.setDefaultTransactionSettings();
  }

  closeModal() {
    this.transactionModal.visible = false;
  }

  showModal() {
    this.transactionModal.visible = true;
  }

  render() {
    return (
      <i-modal
        id="transactionModal"
        title="Transaction Settings"
        minHeight={475}
        closeIcon={{ name: 'times' }}
      >
        <i-panel id="mainContent">
          <i-panel class="settings-content">
            <i-vstack gap={10} margin={{ bottom: 20 }}>
              <i-hstack gap={8} horizontalAlignment="space-between" verticalAlignment="center" margin={{ top: 16 }}>
                <i-vstack gap={4}>
                  <i-label class="text-left" caption="Auto Router API" />
                  <i-label caption="Use the Uniswap Labs API to get faster quotes." font={{ size: '12px' }} opacity={0.8} class="text-left" />
                </i-vstack>
                <i-switch
                  id="switchRouter"
                  checkedTrackColor="transparent"
                  uncheckedTrackColor="transparent"
                  checkedThumbText="Off"
                  uncheckedThumbText="On"
                  checkedText="Off"
                  uncheckedText="On"
                  checked={isRouterAuto()}
                  onClick={this.toggleRouterAuto}
                />
              </i-hstack>
              <i-vstack id="vStackOptions" visible={false} gap={10} margin={{ bottom: 10 }}>
                <i-hstack gap={8} verticalAlignment="center" padding={{ top: 8, bottom: 8, left: 8, right: 8 }} border={{ radius: 12 }} background={{ color: Theme.background.main }}>
                  <i-vstack gap={4}>
                    <i-label caption="Uniswap API" font={{ bold: true }} class="text-left" />
                    <i-label caption="Finds the best route on the Uniswap Protocol using the Uniswap Labs Routing API." opacity={0.8} font={{ size: '12px' }} class="text-left" />
                  </i-vstack>
                  <i-checkbox id="chbAPI" checked={true} margin={{ left: 'auto' }} height="auto" onChanged={() => this.checkAPIOrClient(true)} />
                </i-hstack>
                <i-hstack gap={8} verticalAlignment="center" padding={{ top: 8, bottom: 8, left: 8, right: 8 }} border={{ radius: 12 }} background={{ color: Theme.background.main }}>
                  <i-vstack gap={4}>
                    <i-label caption="Uniswap Client" font={{ bold: true }} class="text-left" />
                    <i-label caption="Finds the best route on the Uniswap Protocol through your browser. May result in high latency and prices." opacity={0.8} font={{ size: '12px' }} class="text-left" />
                  </i-vstack>
                  <i-checkbox id="chbClient" margin={{ left: 'auto' }} height="auto" onChanged={() => this.checkAPIOrClient()} />
                </i-hstack>
              </i-vstack>
            </i-vstack>
            <i-hstack verticalAlignment="center">
              <i-label caption="Slippage Tolerance" />
              <i-icon
                width={16}
                height={16}
                name="question-circle"
                fill={Theme.text.primary}
                tooltip={{
                  content: 'Your transaction will revert if the price changes unfavorably by more than this percentage.'
                }}
              />
            </i-hstack>
            <i-hstack id="slippageGroup" gap={8}>
              <i-input
                id="slippageInput"
                height={40}
                width="100%"
                inputType="number"
                class="transaction-input"
                onChanged={(source: Control, event: Event) => this.inputSlippageTolerance(source, (source as Input).value)}
                onBlur={this.blurSlippageTolerance}
              />
            </i-hstack>
            <i-hstack>
              <i-label class="slippage-message" caption={this.slippageToleranceMessage} />
            </i-hstack>
            <i-hstack verticalAlignment="center" margin={{ top: 24, bottom: 12 }}>
              <i-label caption="Transaction Deadline" />
              <i-icon
                width={16}
                height={16}
                name="question-circle"
                fill={Theme.text.primary}
                tooltip={{
                  content: 'Your transaction will revert if it is pending for more than this long.'
                }}
              />
            </i-hstack>
            <i-hstack verticalAlignment="center">
              <i-input
                id="deadlineInput"
                height={40}
                width="100%"
                class="transaction-input"
                inputType="number"
                onChanged={this.inputDeadline}
                onBlur={this.blurTransactionDeadline}
              />
              <i-label caption="minutes" margin={{ left: 16 }} />
            </i-hstack>
            <i-hstack id="deadlineGroup" />
          </i-panel>
        </i-panel>
      </i-modal>
    )
  }
};