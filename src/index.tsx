import { Module, Panel, Button, Label, VStack, Image, Container, IEventBus, application, customModule, Modal, Input, Control, customElements, ControlElement, IDataSchema, Styles, Icon } from '@ijstech/components';
import { BigNumber } from '@ijstech/eth-wallet';
import './index.css';
import {
  getChainId,
  isExpertMode,
  getSlippageTolerance,
  isWalletConnected,
  setDataFromConfig,
  setProviderList,
  getProviderByKey,
  getEmbedderCommissionFee,
  getProxyAddress,
  getSupportedTokens,
  setDexInfoList,
  getChainNativeToken,
  isAPI,
  isRouterAuto
} from './store/index';
import { tokenStore, DefaultERC20Tokens, ChainNativeTokenByChainId, assets as tokenAssets } from '@scom/scom-token-list';

import {
  getAllRoutesData,
  executeSwap,
  getApprovalModelAction,
  setApprovalModalSpenderAddress,
  getCommissionAmount,
  getCurrentCommissions,
  getTokenPrice,
  getBestAmountOutRouteUniV3
} from './swap-utils/index';

import {
  ITokenObject,
  formatNumber,
  ApprovalStatus,
  EventId,
  IERC20ApprovalAction,
  limitDecimals,
  isInvalidInput,
  IProvider,
  ISwapConfigUI,
  IProviderUI,
  Category,
  ICommissionInfo,
  INetworkConfig
} from './global/index';

import { PriceInfo, ExpertModeSettings, TransactionSettings, Alert } from './common/index';
import { TokenSelection } from './token-selection/index';
import configData from './data.json';
import ScomWalletModal, { IWalletPlugin } from '@scom/scom-wallet-modal';
import ScomDappContainer from '@scom/scom-dapp-container';
import getDexList from '@scom/scom-dex-list';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';

const Theme = Styles.Theme.ThemeVars;
const priceImpactTooHighMsg = 'Price Impact Too High. If you want to bypass this check, please turn on Expert Mode';
const defaultInput = '1';
type StatusMapType = 'approve' | 'swap';

interface ScomUniswapV3Element extends ControlElement {
  lazyLoad?: boolean;
  category: Category;
  providers: IProviderUI[];
  tokens?: ITokenObject[];
  defaultChainId: number;
  networks: INetworkConfig[];
  wallets: IWalletPlugin[];
  showHeader?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-uniswap-v3']: ScomUniswapV3Element;
    }
  }
}
declare const window: any;

@customModule
@customElements('i-scom-uniswap-v3')
export default class ScomUniswapV3 extends Module {
  private _data: ISwapConfigUI = {
    category: 'fixed-pair',
    providers: [],
    tokens: [],
    defaultChainId: 0,
    wallets: [],
    networks: []
  };
  tag: any = {};
  defaultEdit: boolean = true

  private swapComponent: Panel;
  private pnlPriceInfo: Panel;
  private isInited: boolean = false;

  private payBalance: Label;
  private receiveBalance: Label;
  private payUSD: Label;
  private receiveUSD: Label;
  private firstTokenSelection: TokenSelection;
  private secondTokenSelection: TokenSelection;
  private payCol: VStack;
  private receiveCol: VStack;
  private swapModal: Modal;
  private priceInfo: PriceInfo;
  private priceInfo2: PriceInfo;
  private priceInfoContainer: Panel;
  private fromTokenImage: Image;
  private fromTokenValue: Label;
  private toTokenImage: Image;
  private toTokenValue: Label;
  private lbPayUSD: Label;
  private lbReceiveUSD: Label;
  private uniswapAlert: Alert;
  private btnSwap: Button;
  private mdWallet: ScomWalletModal;
  private dappContainer: ScomDappContainer;

  private isFrom: boolean;
  private fromToken?: ITokenObject;
  private toToken?: ITokenObject;
  private fromTokenSymbol: string;
  private toTokenSymbol: string;
  private fromInputValue: BigNumber;
  private toInputValue: BigNumber;
  private timeout: any; // NodeJS.Timeout;
  private isPriceToggled: boolean;
  private record: any;
  private allTokenBalancesMap: { [key: string]: string };

  private currentChainId: number;
  private supportedChainIds: number[];
  private swapButtonStatusMap: { [key: string]: ApprovalStatus };
  private approveButtonStatusMap: { [key: string]: ApprovalStatus };
  private $eventBus: IEventBus;
  private approvalModelAction: IERC20ApprovalAction;

  // Cross Chain
  private toggleReverseImage: Icon;
  private swapModalConfirmBtn: Button;

  private expertModal: ExpertModeSettings;
  private transactionModal: TransactionSettings;
  private contractAddress: string;
  private uniswapAPI: boolean = true;

  static async create(options?: ScomUniswapV3Element, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get category() {
    return this._data.category;
  }

  set category(value: Category) {
    this._data.category = value;
  }

  get providers() {
    return this._data.providers;
  }

  set providers(value: IProviderUI[]) {
    this._data.providers = value;
  }

  get commissions() {
    return this._data.commissions ?? [];
  }

  set commissions(value: ICommissionInfo[]) {
    this._data.commissions = value;
  }

  get defaultChainId() {
    return this._data.defaultChainId;
  }

  set defaultChainId(value: number) {
    this._data.defaultChainId = value;
  }

  get wallets() {
    return this._data.wallets ?? [];
  }

  set wallets(value: IWalletPlugin[]) {
    this._data.wallets = value;
  }

  get networks() {
    return this._data.networks ?? [];
  }

  set networks(value: INetworkConfig[]) {
    this._data.networks = value;
  }

  get showHeader() {
    return this._data.showHeader ?? true;
  }

  set showHeader(value: boolean) {
    this._data.showHeader = value;
  }

  private get hasData() {
    const { providers, defaultChainId, networks, wallets } = this._data;
    return !!(providers?.length || networks?.length || wallets?.length || !isNaN(Number(defaultChainId)));
  }

  private getActions() {
    const propertiesSchema: any = {
      type: "object",
      properties: {
        category: {
          type: "string",
          required: true,
          enum: [
            "fixed-pair",
            "aggregator"
          ]
        },
        tokens: {
          type: "array",
          required: true,
          items: {
            type: "object",
            properties: {
              chainId: {
                type: "number",
                enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
                required: true
              },
              address: {
                type: "string",
                required: true
              }
            }
          }
        },
        providers: {
          type: "array",
          required: true,
          items: {
            type: "object",
            properties: {
              caption: {
                type: "string",
                required: true
              },
              image: {
                type: "string",
                required: true
              },
              key: {
                type: "string",
                required: true
              },
              dexId: {
                type: "number"
              },
              chainId: {
                type: "number",
                enum: [1, 56, 137, 250, 97, 80001, 43113, 43114],
                required: true
              }
            }
          }
        }
      }
    }

    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        "dark": {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color'
            },
            fontColor: {
              type: 'string',
              format: 'color'
            },
            inputBackgroundColor: {
              type: 'string',
              format: 'color'
            },
            inputFontColor: {
              type: 'string',
              format: 'color'
            }
          }
        },
        "light": {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color'
            },
            fontColor: {
              type: 'string',
              format: 'color'
            },
            inputBackgroundColor: {
              type: 'string',
              format: 'color'
            },
            inputFontColor: {
              type: 'string',
              format: 'color'
            }
          }
        }
      }
    }

    return this._getActions(propertiesSchema, themeSchema);
  }

  private _getActions(propertiesSchema: IDataSchema, themeSchema: IDataSchema) {
    let self = this;
    const actions = [
      {
        name: 'Commissions',
        icon: 'dollar-sign',
        command: (builder: any, userInputData: any) => {
          let _oldData: ISwapConfigUI = {
            category: 'fixed-pair',
            providers: [],
            defaultChainId: 0,
            wallets: [],
            networks: []
          }
          return {
            execute: async () => {
              _oldData = { ...this._data };
              if (userInputData.commissions) this._data.commissions = userInputData.commissions;
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        customUI: {
          render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
            const vstack = new VStack();
            const config = new ScomCommissionFeeSetup(null, {
              commissions: self._data.commissions,
              fee: getEmbedderCommissionFee(),
              networks: self._data.networks
            });
            const button = new Button(null, {
              caption: 'Confirm',
            });
            vstack.append(config);
            vstack.append(button);
            button.onClick = async () => {
              const commissions = config.commissions;
              if (onConfirm) onConfirm(true, { commissions });
            }
            return vstack;
          }
        }
      },
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          let _oldData: ISwapConfigUI = {
            category: 'fixed-pair',
            providers: [],
            defaultChainId: 0,
            wallets: [],
            networks: []
          }
          return {
            execute: async () => {
              _oldData = { ...this._data };
              this._data.category = userInputData.category;
              this._data.providers = userInputData.providers;
              this._data.tokens = [];
              if (userInputData.tokens) {
                for (let inputToken of userInputData.tokens) {
                  if (!inputToken.address) {
                    const nativeToken = ChainNativeTokenByChainId[inputToken.chainId];
                    if (nativeToken) this._data.tokens.push({ ...nativeToken, chainId: inputToken.chainId });
                  }
                  else {
                    const tokens = DefaultERC20Tokens[inputToken.chainId]
                    const token = tokens.find(v => v.address === inputToken.address);
                    if (token) this._data.tokens.push({ ...token, chainId: inputToken.chainId });
                  }
                }
              }
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: propertiesSchema,
        userInputUISchema: {
          "type": "VerticalLayout",
          "elements": [
            {
              "type": "HorizontalLayout",
              "elements": [
                {
                  "type": "Control",
                  "scope": "#/properties/category"
                }
              ]
            },
            {
              "type": "HorizontalLayout",
              "elements": [
                {
                  "type": "Categorization",
                  "elements": [
                    {
                      "type": "Category",
                      "label": "Providers",
                      "elements": [
                        {
                          "type": "Control",
                          "scope": "#/properties/providers",
                          "options": {
                            "detail": {
                              "type": "VerticalLayout"
                            }
                          }
                        }
                      ]
                    },
                    {
                      "type": "Category",
                      "label": "Tokens",
                      "elements": [
                        {
                          "type": "Control",
                          "scope": "#/properties/tokens",
                          "options": {
                            "detail": {
                              "type": "VerticalLayout"
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          let oldTag = {};
          return {
            execute: async () => {
              if (!userInputData) return;
              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder) builder.setTag(userInputData);
              else this.setTag(userInputData);
              if (this.dappContainer) this.dappContainer.setTag(userInputData);
            },
            undo: () => {
              if (!userInputData) return;
              this.tag = JSON.parse(JSON.stringify(oldTag));
              if (builder) builder.setTag(this.tag);
              else this.setTag(this.tag);
              if (this.dappContainer) this.dappContainer.setTag(this.tag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: themeSchema
      }
    ]
    return actions
  }

  getConfigurators() {
    let self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: this.getActions.bind(this),
        getData: this.getData.bind(this),
        setData: async (value: any) => {
          const defaultData = configData.defaultBuilderData;
          this._data = { ...defaultData, ...value };
          this.updateContractAddress();
          await this.refreshUI();
          if (this.mdWallet) {
            this.mdWallet.networks = this._data.networks;
            this.mdWallet.wallets = this._data.wallets;
          }
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Embedder Configurator',
        target: 'Embedders',
        elementName: 'i-scom-commission-fee-setup',
        getLinkParams: () => {
          const commissions = this._data.commissions || [];
          return {
            data: window.btoa(JSON.stringify(commissions))
          }
        },
        setLinkParams: async (params: any) => {
          if (params.data) {
            const decodedString = window.atob(params.data);
            const commissions = JSON.parse(decodedString);
            let resultingData = {
              ...self._data,
              commissions
            };
            await this.setData(resultingData);
          }
        },
        bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => {
          element.onChanged = async (data: any) => {
            const commissions: ICommissionInfo[] = data.commissions;
            if (commissions) {
              this.supportedChainIds = commissions.map(v => v.chainId).filter((v, i, a) => a.indexOf(v) === i);
            }
            let resultingData = {
              ...self._data,
              ...data
            };

            await this.setData(resultingData);
            await callback(data);
          }
        },
        getData: () => {
          const fee = getEmbedderCommissionFee();
          return { ...this.getData(), fee }
        },
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private async getData() {
    return this._data;
  }

  private async setData(value: ISwapConfigUI) {
    this._data = value;
    this.updateContractAddress();
    await this.refreshUI();
    if (this.mdWallet) {
      this.mdWallet.networks = value.networks;
      this.mdWallet.wallets = value.wallets;
    }
  }

  private async getTag() {
    return this.tag;
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.tag[type][prop] = value[prop];
    }
  }

  private async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.tag[prop] = newValue[prop];
      }
    }
    if (this.dappContainer)
      this.dappContainer.setTag(this.tag);
    this.updateTheme();
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this.dappContainer?.theme || 'light';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
    this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
  }

  private setProviders() {
    const providers = this.originalData?.providers || [];
    if (this.isFixedPair) {
      setProviderList([providers[0]]);
    } else {
      setProviderList(providers);
    }
  }

  private updateContractAddress() {
    if (this.approvalModelAction) {
      if (getCurrentCommissions(this.commissions).length) {
        this.contractAddress = getProxyAddress();
      } else {
        this.contractAddress = '';
      }
      this.setApprovalSpenderAddress();
    }
  }

  private get isFixedPair() {
    return this._data?.category === 'fixed-pair';
  }

  private get originalData() {
    if (!this._data) return undefined;
    const { category, providers } = this._data;
    if (!providers.length) return undefined;
    let _providers: IProvider[] = [];
    if (this.isFixedPair) {
      const { key, caption, image, dexId } = providers[0];
      let defaultProvider: IProvider = {
        caption,
        image,
        key,
        dexId
      };
      _providers.push(defaultProvider);
    } else {
      let providersByKeys: { [key: string]: IProviderUI[] } = {};
      providers.forEach(v => {
        if (!providersByKeys[v.key]) {
          providersByKeys[v.key] = [];
        }
        providersByKeys[v.key].push(v);
      });
      Object.keys(providersByKeys).forEach(k => {
        const arr = providersByKeys[k];
        const { key, caption, image, dexId } = arr[0];
        let defaultProvider: IProvider = {
          caption,
          image,
          key,
          dexId
        }
        _providers.push(defaultProvider);
      })
    }
    return { category, providers: _providers };
  }

  private async refreshUI() {
    const dexList = getDexList();
    setDexInfoList(dexList);
    this.setProviders();
    await this.initData();
    await this.onSetupPage(isWalletConnected());
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    setDataFromConfig(configData);
    this.fromInputValue = new BigNumber(0);
    this.toInputValue = new BigNumber(0);
    this.swapButtonStatusMap = {};
    this.approveButtonStatusMap = {};
    this.$eventBus = application.EventBus;
    this.registerEvent();
  }

  private registerEvent() {
    this.$eventBus.register(this, EventId.IsWalletConnected, this.onWalletConnect)
    this.$eventBus.register(this, EventId.IsWalletDisconnected, this.onWalletDisconnect)
    this.$eventBus.register(this, EventId.chainChanged, this.onChainChange)
    this.$eventBus.register(this, EventId.SlippageToleranceChanged, () => { this.priceInfo.items = this.getPriceInfo() })
    this.$eventBus.register(this, EventId.ExpertModeChanged, () => {
      this.updateSwapButtonCaption();
    });
  }

  private onWalletConnect = async (connected: boolean) => {
    if (connected && (this.currentChainId == null || this.currentChainId == undefined)) {
      this.onChainChange();
    } else {
      if (this.originalData?.providers?.length) await this.onSetupPage(connected);
    }
  }

  private onWalletDisconnect = async (connected: boolean) => {
    if (!connected) {
      await this.onSetupPage(connected);
    }
  }

  private onChainChange = async () => {
    this.currentChainId = getChainId();
    if (this.currentChainId != null && this.currentChainId != undefined)
      this.btnSwap.visible = true;
    // this.availableMarkets = getAvailableMarkets() || [];
    this.updateContractAddress();
    if (this.originalData?.providers?.length) await this.onSetupPage(true);
    this.updateSwapButtonCaption();
  }

  get isApproveButtonShown(): boolean {
    const warningMessageText = this.getWarningMessageText();
    return warningMessageText === '' && this.approveButtonStatus !== ApprovalStatus.NONE
  }

  get isPriceImpactTooHigh(): boolean {
    const warningMessageText = this.getWarningMessageText();
    return this.record?.priceImpact > 15 && !isExpertMode() && warningMessageText === priceImpactTooHighMsg
  }

  get isInsufficientBalance(): boolean {
    if (!this.fromToken || !this.record) return false;
    const balance = this.getBalance(this.fromToken);
    return this.maxSold.gt(balance);
  }

  get maxSold() {
    if (!this.fromToken || !this.record) return new BigNumber(0)
    const commissionAmount = getCommissionAmount(this.commissions, new BigNumber(this.record.fromAmount));
    const amountWithCommission = this.record.fromAmount.plus(commissionAmount);
    if (!this.isFrom) return new BigNumber(amountWithCommission);
    return new BigNumber(this.getMinReceivedMaxSold() || amountWithCommission);
  }

  get isSwapping(): boolean {
    const key = this.record?.key;
    return key && this.swapButtonStatusMap[key] === ApprovalStatus.APPROVING;
  }

  get approveButtonStatus() {
    const key = this.record?.key;
    return this.approveButtonStatusMap[key];
  }

  get isApprovingRouter(): boolean {
    return this.approveButtonStatus === ApprovalStatus.APPROVING;
  }

  get isValidToken(): boolean {
    if (this.fromToken?.symbol && this.toToken?.symbol) {
      return true;
    }
    return false;
  }

  private redirectToken = () => {
    let queryRouter: any = {
      chainId: this.currentChainId,
      fromToken: this.fromToken?.symbol || this.fromTokenSymbol,
      toToken: this.toToken?.symbol || this.toTokenSymbol,
    };
    if (this.isFrom) {
      queryRouter = {
        ...queryRouter,
        toAmount: this.toInputValue.toFixed(),
      };
    } else {
      queryRouter = {
        ...queryRouter,
        fromAmount: this.fromInputValue.toFixed(),
      };
    }
    this.fromTokenSymbol = queryRouter.fromToken;
    this.toTokenSymbol = queryRouter.toToken;
  }

  private fixedNumber = (value: BigNumber | string | number) => {
    const val = typeof value === 'object' ? value : new BigNumber(value);
    if (val.isNaN() || val.isZero()) return '';
    let formatted = '';
    if (val.gte(1)) {
      formatted = val.toNumber().toLocaleString('en-US', { maximumFractionDigits: 4 });
    } else {
      formatted = val.toNumber().toLocaleString('en-US', { maximumSignificantDigits: 4 });
    }
    return formatted.replace(/,/g, '');
  }

  private setFixedPairData() {
    let currentChainTokens = this._data.tokens.filter((token) => token.chainId === this.currentChainId);
    if (currentChainTokens.length < 2) return;
    const providers = this.originalData?.providers;
    if (providers && providers.length) {
      const fromTokenAddress = currentChainTokens[0].address;
      const toTokenAddress = currentChainTokens[1].address;
      const fromToken = fromTokenAddress.toLowerCase().startsWith('0x') ? fromTokenAddress.toLowerCase() : fromTokenAddress;
      const toToken = toTokenAddress.toLowerCase().startsWith('0x') ? toTokenAddress.toLowerCase() : toTokenAddress;
      this.fromToken = tokenStore.tokenMap[fromToken];
      this.toToken = tokenStore.tokenMap[toToken];
      this.fromTokenSymbol = this.fromToken?.symbol;
      this.toTokenSymbol = this.toToken?.symbol;
      this.fromInputValue = new BigNumber(defaultInput);
      this.onUpdateToken(this.fromToken, true);
      this.onUpdateToken(this.toToken, false);
      this.firstTokenSelection.token = this.fromToken;
      this.secondTokenSelection.token = this.toToken;
      this.toggleReverseImage.classList.add('cursor-default');
    }
  }

  private onSetupPage = async (connected: boolean, _chainId?: number) => {
    const data = {
      defaultChainId: this.defaultChainId,
      wallets: this.wallets,
      networks: this.networks,
      showHeader: this.showHeader
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data)
    this.currentChainId = _chainId ? _chainId : getChainId();
    tokenStore.updateTokenMapData();
    if (this.isFixedPair) {
      this.setFixedPairData();
    }
    this.toggleReverseImage.enabled = !this.isFixedPair;
    this.firstTokenSelection.disableSelect = this.isFixedPair;
    this.secondTokenSelection.disableSelect = this.isFixedPair;

    this.updateSwapButtonCaption();
    await this.updateBalance();
    const input = this.receiveCol.children[0] as Input;
    if (input) {
      input.readOnly = false;
    }
    if (!this.isFixedPair) {
      this.toggleReverseImage.classList.remove('cursor-default');
    }
    if (this.fromInputValue.isGreaterThanOrEqualTo(0)) {
      this.onUpdateEstimatedPosition(false, true);
      const input = this.payCol.children[0] as Input;
      if (input) {
        input.value = this.fixedNumber(this.fromInputValue);
      }
    } else if (this.toInputValue.isGreaterThanOrEqualTo(0)) {
      this.onUpdateEstimatedPosition(true, true);
      const input = this.receiveCol.children[0] as Input;
      if (input) {
        input.value = this.fixedNumber(this.toInputValue);
      }
    }
    const tokens = getSupportedTokens(this._data.tokens || [], this.currentChainId);
    this.firstTokenSelection.tokenDataListProp = tokens;
    this.secondTokenSelection.tokenDataListProp = tokens;

    if (!this.record)
      this.btnSwap.enabled = false;
    this.onRenderPriceInfo();
    this.redirectToken();
    await this.handleAddRoute();
  }

  private async initTokenSelection() {
    await this.firstTokenSelection.ready();
    await this.secondTokenSelection.ready();
    this.firstTokenSelection.disableSelect = false;
    this.firstTokenSelection.onSelectToken = (token: ITokenObject) => this.onSelectToken(token, true);
    this.firstTokenSelection.isBtnMaxShown = false;
    this.firstTokenSelection.isCommonShown = true;
    this.secondTokenSelection.disableSelect = false;
    this.secondTokenSelection.onSelectToken = (token: ITokenObject) => this.onSelectToken(token, false);
    this.secondTokenSelection.isBtnMaxShown = false;
    this.secondTokenSelection.isCommonShown = true;
  }

  private async initApprovalModelAction() {
    this.approvalModelAction = await getApprovalModelAction({
      sender: this,
      payAction: this.onSubmit,
      onToBeApproved: async (token: ITokenObject) => {
        this.btnSwap.enabled = true;
      },
      onToBePaid: async (token: ITokenObject) => {
      },
      onApproving: async (token: ITokenObject, receipt?: string, data?: any) => {
        this.setMapStatus('approve', data.key, ApprovalStatus.APPROVING);
        this.showAlertMessage('success', receipt);
        this.setEnableInput(false);
        if (this.isApprovingRouter && !this.btnSwap.rightIcon.visible)
          this.btnSwap.rightIcon.visible = true;
      },
      onApproved: async (token: ITokenObject, data?: any) => {
        this.setMapStatus('approve', data.key, ApprovalStatus.NONE);
        this.setEnableInput(true);
        if (this.btnSwap.rightIcon.visible)
          this.btnSwap.rightIcon.visible = false;
        await this.handleAddRoute();
      },
      onApprovingError: async (token: ITokenObject, err: Error) => {
        this.showAlertMessage('error', err);
        this.setEnableInput(false);
        if (this.btnSwap.rightIcon.visible)
          this.btnSwap.rightIcon.visible = false;
      },
      onPaying: async (receipt?: string, data?: any) => {
        this.showAlertMessage('success', receipt);
        this.setEnableInput(false);
        this.onSwapConfirming(data.key);
      },
      onPaid: async (data?: any) => {
        this.onSwapConfirmed({ key: data.key });
        this.setEnableInput(true);
        await this.updateBalance();
        application.EventBus.dispatch(EventId.Paid, 'onPaid');
      },
      onPayingError: async (err: Error) => {
        this.setEnableInput(false);
        this.showAlertMessage('error', err);
      }
    })
  }

  private async onRevertSwap() {
    this.onUpdateEstimatedPosition(!this.isEstimated('from'), true);
    [this.fromToken, this.toToken] = [this.toToken, this.fromToken];
    [this.fromInputValue, this.toInputValue] = [this.toInputValue, this.fromInputValue];
    [this.payBalance.caption, this.receiveBalance.caption] = [this.receiveBalance.caption, this.payBalance.caption];
    [this.payUSD.caption, this.receiveUSD.caption] = [this.receiveUSD.caption, this.payUSD.caption];
    [this.fromTokenSymbol, this.toTokenSymbol] = [this.toTokenSymbol, this.fromTokenSymbol];
    this.firstTokenSelection.token = this.fromToken;
    this.secondTokenSelection.token = this.toToken;

    this.payCol.clearInnerHTML();
    this.receiveCol.clearInnerHTML();
    this.payCol.appendChild(<i-input class="token-input" width="100%" placeholder="0.0" inputType="number" value={this.getInputValue(true)} onKeyUp={this.onTokenInputChange.bind(this)} />);
    this.receiveCol.appendChild(<i-input class="token-input" width="100%" placeholder="0.0" inputType="number" value={this.getInputValue(false)} onKeyUp={this.onTokenInputChange.bind(this)} />);
    this.redirectToken();

    await this.handleAddRoute();
  }

  private totalAmount = () => {
    const commissionAmount = getCommissionAmount(this.commissions, this.fromInputValue);
    return this.fromInputValue.plus(commissionAmount);
  }

  private handleSwapPopup() {
    if (!this.record) return;
    this.fromTokenImage.url = tokenAssets.tokenPath(this.fromToken, this.currentChainId);
    this.fromTokenValue.caption = `${formatNumber(this.totalAmount(), 4)} ${this.fromToken?.symbol ?? ''}`;
    this.toTokenImage.url = tokenAssets.tokenPath(this.toToken, this.currentChainId);
    this.toTokenValue.caption = `${formatNumber(this.toInputValue, 4)} ${this.toToken?.symbol ?? ''}`;
    this.priceInfo2.items = this.getPriceInfo(true);
    this.swapModal.visible = true;
  }

  private doSwap() {
    this.approvalModelAction.doPayAction(this.record);
  }

  private getMinReceivedMaxSold = (): number | null => {
    const slippageTolerance = getSlippageTolerance();
    if (!slippageTolerance) return null;
    if (this.isFrom) {
      const poolAmount = new BigNumber(this.record?.amountIn);
      if (poolAmount.isZero()) return null;
      const commissionAmount = getCommissionAmount(this.commissions, poolAmount);
      const minReceivedMaxSold = poolAmount.plus(commissionAmount).times(1 + slippageTolerance / 100).toNumber();
      return minReceivedMaxSold;
    } else {
      const poolAmount = new BigNumber(this.record?.amountOut);
      if (poolAmount.isZero()) return null;
      const minReceivedMaxSold = poolAmount.times(1 - slippageTolerance / 100).toNumber();
      return minReceivedMaxSold;
    }
  }

  private async updateUSDPrice(token: ITokenObject, isFrom: boolean) {
    // const val = isFrom ? this.fromInputValue : this.toInputValue;
    // let usd = '';
    // if (val.gt(0)) {
    //   usd = await getTokenPrice(token.address) || '';
    // }
    // if (isFrom) {
    //   this.payUSD.caption = usd ? `$${formatNumber(this.fromInputValue.multipliedBy(usd), 2)}` : '';
    //   this.lbPayUSD.caption = usd ? `$${formatNumber(this.fromInputValue.multipliedBy(usd), 2)}` : '';
    // } else {
    //   this.receiveUSD.caption = usd ? `$${formatNumber(this.toInputValue.multipliedBy(usd), 2)}` : '';
    //   this.lbReceiveUSD.caption = usd ? `$${formatNumber(this.toInputValue.multipliedBy(usd), 2)}` : '';
    // }
  }

  private onUpdateToken(token: ITokenObject, isFrom: boolean) {
    if (!token) return;
    const balance = this.getBalance(token);
    if (isFrom) {
      this.fromToken = token;
      if (this.fromInputValue.gt(0)) {
        const fromInput = this.payCol.getElementsByTagName('I-INPUT')?.[0] as Input;
        // const toInput = this.receiveCol.getElementsByTagName('I-INPUT')?.[0] as Input;
        const limit = limitDecimals(this.fromInputValue.toFixed(), token.decimals || 18);
        if (!this.fromInputValue.eq(limit)) {
          if (fromInput) {
            fromInput.value = limit === '0' ? '' : limit;
          }
          this.fromInputValue = new BigNumber(limit);
        }
      } else if (this.fromInputValue.isZero()) {
        this.onUpdateEstimatedPosition(true);
      }
      this.payBalance.caption = `Balance: ${formatNumber(balance, 4)} ${token.symbol}`;
      this.updateUSDPrice(token, true);
      this.updateTokenInput(true);
    } else {
      this.toToken = token;
      if (this.toInputValue.gt(0)) {
        const toInput = this.receiveCol.getElementsByTagName('I-INPUT')?.[0] as Input;
        const limit = limitDecimals(this.toInputValue.toFixed(), token.decimals || 18);
        if (!this.toInputValue.eq(limit)) {
          if (toInput) {
            toInput.value = limit === '0' ? '' : limit;
          }
          this.toInputValue = new BigNumber(limit);
        }
      } else if (this.toInputValue.isZero()) {
        this.onUpdateEstimatedPosition(false);
      }
      this.receiveBalance.caption = `Balance: ${formatNumber(balance, 4)} ${token.symbol}`;
      this.updateUSDPrice(token, false);
      this.updateTokenInput(false);
    }
  }

  private async onSelectToken(token: ITokenObject, isFrom: boolean) {
    this.firstTokenSelection.enabled = false;
    this.secondTokenSelection.enabled = false;
    if (token.isNew && isWalletConnected()) {
      await tokenStore.updateAllTokenBalances();
      this.allTokenBalancesMap = tokenStore.tokenBalances;
    }
    this.onUpdateToken(token, isFrom);
    this.redirectToken();
    await this.handleAddRoute();
    this.firstTokenSelection.enabled = true;
    this.secondTokenSelection.enabled = true;
  }

  private setApprovalSpenderAddress() {
    const item = this.record;
    if (!item) return;
    const market = getProviderByKey(item.provider)?.key || '';
    if (this.approvalModelAction) {
      if (getCurrentCommissions(this.commissions).length) {
        this.contractAddress = getProxyAddress();
        setApprovalModalSpenderAddress(market, this.contractAddress);
      } else {
        setApprovalModalSpenderAddress(market);
      }
    }
  }

  private getInputValue(isFrom: boolean) {
    const token = isFrom ? this.fromToken : this.toToken;
    const value = isFrom ? this.fromInputValue : this.toInputValue;
    if (!value || value.isNaN()) return '';
    return limitDecimals(value.toFixed(), token?.decimals || 18);
  }

  private async updateTokenInput(isFrom: boolean, init?: boolean) {
    const _col = isFrom ? this.payCol : this.receiveCol;
    const label = _col.querySelector('i-label') as Node;
    if (init && !label) {
      _col.innerHTML = '';
      const label = await Label.create({
        caption: '0',
        opacity: 0.6,
        font: { size: '1.5rem' }
      });
      _col.appendChild(label);
    }
    else if (!init && label) {
      _col.removeChild(label);
      const input: Input = await Input.create();
      input.width = '100%';
      input.placeholder = '0.0';
      input.inputType = 'number';
      input.value = this.getInputValue(isFrom) === '0' ? '' : this.getInputValue(isFrom);
      input.onKeyUp = this.onTokenInputChange.bind(this);
      input.classList.add('token-input');
      _col.appendChild(input);
    }
  }

  private async onSelectRouteItem(item: any) {
    if (this.isFrom) {
      if (this.payCol.children) {
        let balanceValue = item.amountIn;
        const input = this.payCol.children[0] as Input;
        input.value = this.fixedNumber(balanceValue);
        this.fromInputValue = typeof balanceValue !== 'object' ? new BigNumber(balanceValue) : balanceValue;
      }
    } else {
      if (this.receiveCol.children) {
        let balanceValue = item.amountOut;
        const input = this.receiveCol.children[0] as Input;
        input.value = this.fixedNumber(balanceValue);
        this.toInputValue = typeof balanceValue !== 'object' ? new BigNumber(balanceValue) : balanceValue;
      }
    }

    this.btnSwap.visible = true;
    this.record = item;
    this.updateSwapButton();
    const isButtonLoading = this.isButtonLoading();
    if (this.btnSwap.rightIcon.visible != isButtonLoading) {
      this.btnSwap.rightIcon.visible = isButtonLoading;
    }
    this.priceInfo.items = this.getPriceInfo();
  }

  private onTokenInputChange(source: Control) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      const fromInput = this.payCol.getElementsByTagName('I-INPUT')?.[0] as Input;
      const toInput = this.receiveCol.getElementsByTagName('I-INPUT')?.[0] as Input;
      const isFrom = source.isSameNode(fromInput);
      const amount = (source as Input).value;
      if (isInvalidInput(amount)) {
        this.resetValuesByInput();
        if (fromInput)
          fromInput.value = '';
        if (toInput)
          toInput.value = '';
        if (this.payUSD) this.payUSD.caption = '';
        if (this.receiveUSD) this.receiveUSD.caption = '';
        return;
      }
      const limit = isFrom ? this.fromToken?.decimals : this.toToken?.decimals;
      const value = new BigNumber(limitDecimals(amount, limit || 18));
      if (!value.gt(0)) {
        this.resetValuesByInput();
        if (isFrom && toInput) {
          toInput.value = '';
        } else if (!isFrom && fromInput) {
          fromInput.value = '';
        }
        if (this.payUSD) this.payUSD.caption = '';
        if (this.receiveUSD) this.receiveUSD.caption = '';
      } else {
        let valueChanged = false;
        const isLastDot = amount.indexOf('.') === amount.length - 1;
        if (isFrom) {
          if (!this.fromInputValue.eq(value)) {
            this.fromInputValue = value;
            this.onUpdateEstimatedPosition(false, true);
            valueChanged = true;
          }
          if (!isLastDot)
            fromInput.value = value.isZero() ? '' : value.toFixed();
        } else {
          if (!this.toInputValue.eq(value)) {
            this.toInputValue = value;
            this.onUpdateEstimatedPosition(true, true);
            valueChanged = true;
          }
          if (!isLastDot)
            toInput.value = value.isZero() ? '' : value.toFixed();
        }
        this.redirectToken();
        if (valueChanged) {
          await this.handleAddRoute();
        } else {
          this.updateSwapButton();
        }
      }
    }, 1000);
  }

  private resetValuesByInput() {
    this.initRoutes();
    this.priceInfo.items = this.getPriceInfo();
    this.fromInputValue = new BigNumber(0);
    this.toInputValue = new BigNumber(0);
    this.updateSwapButton();
    this.redirectToken();
  }

  private initRoutes() {
    this.record = null;
    this.isPriceToggled = false;
    // this.btnSwap.visible = false;
  }

  private async handleAddRoute() {
    if (!this.fromToken || !this.toToken || !(this.fromInputValue.gt(0) || this.toInputValue.gt(0))) {
      this.updateSwapButton();
      return;
    };
    this.initRoutes();
    let listRouting: any[] = [];
    const useAPI = this._data.category === 'aggregator';
    this.updateContractAddress();
    await getBestAmountOutRouteUniV3(this.fromToken, this.toToken, this.fromInputValue.toString())
    // listRouting = await getAllRoutesData(this.fromToken, this.toToken, this.fromInputValue, this.toInputValue, this.isFrom, useAPI, this.commissions);
    listRouting = listRouting.map((v: any) => {
      return {
        ...v,
        isHybrid: false // config.marketCode == Market.HYBRID,
      }
    });
    this.swapModalConfirmBtn.caption = 'Confirm Swap';
    this.swapModalConfirmBtn.enabled = true;
    this.record = listRouting[0] || null;

    this.swapButtonStatusMap = {};
    this.approveButtonStatusMap = {};
    this.initRoutes();
    // const pricePercent = this.getPricePercent(listRouting, false)
    if (listRouting.length) {
      const option = listRouting[0];
      const approveButtonStatus = option.isApproveButtonShown ? ApprovalStatus.TO_BE_APPROVED : ApprovalStatus.NONE;
      this.approveButtonStatusMap[option.key] = approveButtonStatus;
      this.swapButtonStatusMap[option.key] = ApprovalStatus.TO_BE_APPROVED;
      await this.onSelectRouteItem(option);
    } else {
      this.priceInfo.items = this.getPriceInfo();
      if (this.isEstimated('to')) {
        const input = this.receiveCol.children[0] as Input;
        this.toInputValue = new BigNumber(0);
        input.value = '';
      } else {
        const input = this.payCol.children[0] as Input;
        this.fromInputValue = new BigNumber(0);
        input.value = '';
      }
    }
    this.updateSwapButton();
    this.updateUSDPrice(this.fromToken, true);
    this.updateUSDPrice(this.toToken, false);
    if (this.record) {
      this.setApprovalSpenderAddress();
    }
  }

  private getPricePercent(routes: any, isFrom: boolean) {
    if (routes && routes.length > 1) {
      const amountStr = isFrom ? 'amountIn' : 'amountOut'
      const firstAmount = new BigNumber(routes[0][amountStr] || 0);
      const secondAmount = new BigNumber(routes[1][amountStr] || 0);
      if (firstAmount.eq(0) || secondAmount.eq(0)) {
        return 0;
      }
      let percent = new BigNumber(0);
      if (isFrom) {
        percent = secondAmount.minus(firstAmount).dividedBy(firstAmount);
      } else {
        percent = firstAmount.minus(secondAmount).dividedBy(secondAmount);
      }
      percent = percent.multipliedBy(100);
      if (percent.gte(0.01)) {
        return `Save ${formatNumber(percent.toNumber(), 2)}%`;
      }
    }
    return 0
  }

  // Price Info
  private getRate() {
    const value = this.isPriceToggled ? this.record?.priceSwap : this.record?.price;
    let fromSymbol = this.fromToken?.symbol;
    let toSymbol = this.toToken?.symbol;
    if (value || value == 0) {
      if (this.isPriceToggled) {
        return `1 ${fromSymbol} ≈ ${formatNumber(value)} ${toSymbol}`;
      }
      return `1 ${toSymbol} ≈ ${formatNumber(value)} ${fromSymbol}`;
    }
    return null;
  }

  private getPriceImpact() {
    const value = this.record?.priceImpact;
    if (value || value == 0) {
      return `${formatNumber(value)}%`;
    }
    return '-';
  }

  private getMinimumReceived() {
    const value = this.getMinReceivedMaxSold();
    if (value || value == 0) {
      if (this.isFrom) {
        return `${formatNumber(value)} ${this.fromToken?.symbol}`;
      }
      return `${formatNumber(value)} ${this.toToken?.symbol}`;
    }
    return '-';
  }

  private getTradeFeeExactAmount() {
    const tradeFee = this.record?.fromAmount.times(this.record?.tradeFee).toNumber();
    if (tradeFee || tradeFee == 0) {
      return `${formatNumber(tradeFee)} ${this.fromToken?.symbol}`;
    }
    return '-';
  }

  private getPriceInfo(isDetail?: boolean) {
    const rate = this.getRate();
    const priceImpact = this.getPriceImpact();
    const minimumReceived = this.getMinimumReceived();
    const tradeFeeExactAmount = this.getTradeFeeExactAmount();
    const commissionFee = getEmbedderCommissionFee();
    const commissionAmount = this.record ? getCommissionAmount(this.commissions, new BigNumber(this.record.fromAmount || 0)) : new BigNumber(0);

    let detail = [
      {
        title: 'Network fee',
        value: this.isValidToken ? tradeFeeExactAmount : '-',
        tooltip: `The fee paid to miners who process your transaction. This must be paid in ${getChainNativeToken(getChainId() || this.currentChainId)?.symbol || 'native token'}.`
      },
      {
        title: 'Price Impact',
        value: this.isValidToken ? priceImpact : '-',
        tooltip: 'The impact your trade has on the market price of this pool.'
      },
      {
        title: this.isFrom ? 'Maximum Sold' : 'Minimum Received',
        value: this.isValidToken ? minimumReceived : '-',
        tooltip: 'The minimum amount you are guaranteed to receive. If the price slips any further, your transaction will revert.'
      }
    ]

    if (isDetail) {
      detail.unshift({
        title: 'Exchange Rate',
        value: this.isValidToken ? rate : '-',
        tooltip: ''
      })
    } else {
      detail.push({
        title: 'Expected output',
        value: this.isValidToken ? `${formatNumber(this.toInputValue, 4)} ${this.fromToken?.symbol}` : '-',
        tooltip: 'The amount you expect to receive at the current market price. You may receive less or more if the market price changes while your transaction is pending.'
      })
    }

    if (commissionAmount.gt(0)) {
      detail.push({
        title: 'Commission Fee',
        value: this.isValidToken ? `${new BigNumber(commissionFee).times(100)}% (${formatNumber(commissionAmount)} ${this.fromToken?.symbol})` : '-',
        tooltip: ''
      })
    }

    return {
      rate,
      networkFee: tradeFeeExactAmount,
      routing: isAPI() || isRouterAuto() ? 'Uniswap API' : 'Uniswap Client',
      detail
    }
  }

  private onUpdateEstimatedPosition = (isFrom: boolean, reverseRouting: boolean = false) => {
    if (this.isFrom != isFrom) {
      this.isFrom = isFrom;
    }
  }

  private isEstimated = (tokenPosition: string, strict = false) => {
    if (tokenPosition === 'from') {
      return strict ? this.isFrom && !this.fromInputValue.isZero() : this.isFrom;
    } else if (tokenPosition === 'to') {
      return strict ? !this.isFrom && !this.toInputValue.isZero() : !this.isFrom;
    } else {
      return false;
    }
  }

  private getBalance(token?: ITokenObject) {
    if (token && this.allTokenBalancesMap) {
      const address = token.address || '';
      let balance = address ? this.allTokenBalancesMap[address.toLowerCase()] ?? 0 : this.allTokenBalancesMap[token.symbol] || 0;
      return balance;
    }
    return 0;
  }

  private async updateBalance() {
    if (isWalletConnected() && this.hasData) await tokenStore.updateAllTokenBalances();
    this.allTokenBalancesMap = isWalletConnected() ? tokenStore.tokenBalances : {};
    if (this.fromToken) {
      const balance = this.getBalance(this.fromToken);
      this.payBalance.caption = `Balance: ${formatNumber(balance, 4)} ${this.fromToken.symbol}`;
    }
    if (this.toToken) {
      const balance = this.getBalance(this.toToken);
      this.receiveBalance.caption = `Balance: ${formatNumber(balance, 4)} ${this.toToken.symbol}`;
    }
  }

  private setEnableInput(value: boolean) {
    this.firstTokenSelection.enabled = value;
    this.secondTokenSelection.enabled = value;
    (this.payCol.children[0] as Input).enabled = value;
    (this.receiveCol.children[0] as Input).enabled = value;
    this.toggleReverseImage.enabled = value;
  }

  private updateSwapButton() {
    this.updateSwapButtonCaption();
    if (isWalletConnected()) {
      this.btnSwap.enabled = !this.isSwapButtonDisabled() && this.record;
    } else {
      this.btnSwap.enabled = !this.isSwapButtonDisabled();
    }
  }

  private updateSwapButtonCaption() {
    if (this.btnSwap && this.btnSwap.hasChildNodes()) {
      this.btnSwap.caption = this.determineSwapButtonCaption();
    }
  }

  private determineSwapButtonCaption() {
    const isApproveButtonShown = this.isApproveButtonShown;
    if (!isWalletConnected()) {
      return 'Connect Wallet';
    }
    if (!this.fromToken || !this.toToken) {
      return 'Select Token';
    }
    if (!this.record && (this.fromInputValue.gt(0) || this.toInputValue.gt(0))) {
      return 'No Routing';
    }
    if (this.fromInputValue.isNaN() || this.fromInputValue.lte(0) || this.toInputValue.isNaN() || this.toInputValue.lte(0)) {
      return 'Enter Amount';
    }
    if (isApproveButtonShown) {
      const status = this.approveButtonStatus;
      switch (status) {
        case ApprovalStatus.APPROVING:
          return 'Approving';
        case ApprovalStatus.TO_BE_APPROVED:
          return 'Approve';
      }
    } else {
      if (this.isSwapping) {
        return 'Swapping';
      }
      if (this.isInsufficientBalance) {
        return `Insufficient ${this.fromToken?.symbol} balance`;
      }
      if (this.isPriceImpactTooHigh) {
        return 'Turn on Expert Mode'
      }
      return 'Swap';
    }
  }

  private getWarningMessageText() {
    const tokens = [this.fromToken?.symbol, this.toToken?.symbol];
    if (tokens.every(v => v === 'ETH' || v === 'WETH')) {
      return 'Invalid pair';
    }
    if (!this.record) {
      return '';
    }
    if (this.record.key === 'Oracle' && (this.record.fromAmount.isZero() || this.record.toAmount.isZero())) {
      return 'Circuit breaker triggered';
    }
    const balance = this.getBalance(this.fromToken);
    if (this.maxSold.gt(balance)) {
      return `Insufficient ${this.fromToken?.symbol} balance`;
    }
    if (this.record.priceImpact > 15 && !isExpertMode()) {
      return priceImpactTooHighMsg;
    }
    return '';
  }

  private setMapStatus(type: StatusMapType, key: string, status: ApprovalStatus) {
    let mapStatus = {};
    if (type === 'approve') {
      mapStatus = this.approveButtonStatusMap;
      mapStatus[key] = status;
      this.approveButtonStatusMap = {
        ...mapStatus
      };
    } else {
      mapStatus = this.swapButtonStatusMap;
      mapStatus[key] = status;
      this.swapButtonStatusMap = {
        ...mapStatus
      };
    }
    this.updateSwapButtonCaption();
  }

  private onSwapConfirming = (key: string) => {
    this.setMapStatus('swap', key, ApprovalStatus.APPROVING);
    if (!this.btnSwap.rightIcon.visible)
      this.btnSwap.rightIcon.visible = true;
  }

  private onSwapConfirmed = async (data: any) => {
    const { key } = data;
    this.setMapStatus('swap', key, ApprovalStatus.TO_BE_APPROVED);
    if (this.btnSwap.rightIcon.visible)
      this.btnSwap.rightIcon.visible = false;
    await this.handleAddRoute();
  }

  private isButtonLoading() {
    if (this.isApproveButtonShown) {
      return this.isApprovingRouter;
    }
    return this.isSwapping;
  }

  private isSwapButtonDisabled() {
    const warningMessageText = this.getWarningMessageText();
    return (isWalletConnected() && (warningMessageText != '' && !this.isPriceImpactTooHigh));
  }

  private onClickSwapButton() {
    if (!isWalletConnected()) {
      this.mdWallet.showModal();
      return;
    }
    if (!this.record || this.isSwapButtonDisabled()) return;

    const isApproveButtonShown = this.isApproveButtonShown;
    if (isApproveButtonShown) {
      this.onApproveRouterMax();
      return;
    }
    if (this.isPriceImpactTooHigh) {
      this.expertModal.showModal();
      return;
    }
    this.handleSwapPopup();
  }

  private onSubmit = async () => {
    try {
      this.swapModal.visible = false;
      this.showAlertMessage('warning', `Swapping ${formatNumber(this.totalAmount(), 4)} ${this.fromToken?.symbol} to ${formatNumber(this.toInputValue, 4)} ${this.toToken?.symbol}`);
      const route = this.record.bestRoute ? this.record.bestRoute : [this.fromToken, this.toToken];
      const swapData = {
        provider: this.record.provider,
        queueType: this.record.queueType,
        routeTokens: this.record.bestRoute,
        bestSmartRoute: route,
        pairs: this.record.pairs,
        fromAmount: this.record.fromAmount,
        toAmount: this.record.toAmount,
        isFromEstimated: this.isFrom,
        providerList: this.originalData?.providers || [],
        commissions: this.commissions
      }

      const { error } = await executeSwap(swapData);
      if (error) {
        this.showAlertMessage('error', error as any);
      }
    } catch (error) {
      console.error(error);
    }
  }

  private onApproveRouterMax = () => {
    this.showAlertMessage('warning', 'Approving');
    this.setApprovalSpenderAddress();
    this.approvalModelAction.doApproveAction(this.fromToken as ITokenObject, this.totalAmount().toString(), this.record);
  }

  private onRenderPriceInfo() {
    if (!this.priceInfo) {
      this.priceInfo = new PriceInfo();
      this.pnlPriceInfo.appendChild(this.priceInfo);
      this.priceInfo.toggleRate = () => {
        this.isPriceToggled = !this.isPriceToggled;
        this.priceInfo.items = this.getPriceInfo();
      }
    }
    this.priceInfo.items = this.getPriceInfo();

    if (!this.priceInfo2) {
      this.priceInfo2 = new PriceInfo();
      this.priceInfo2.isBorderShown = false;
    }
    this.priceInfoContainer.appendChild(this.priceInfo2);
  }

  private showAlertMessage = (status: 'warning' | 'success' | 'error', content?: string | Error) => {
    if (!this.uniswapAlert) return;
    let params: any = { status };
    if (status === 'success') {
      params.txtHash = content;
    } else {
      params.content = content;
    }
    this.uniswapAlert.message = { ...params };
    this.uniswapAlert.showModal();
  }

  private initAlert() {
    this.uniswapAlert = new Alert();
    this.swapComponent.appendChild(this.uniswapAlert);
  }

  private initExpertModal() {
    this.expertModal = new ExpertModeSettings();
    this.swapComponent.appendChild(this.expertModal);
  }

  private initTransactionSettings() {
    this.transactionModal = new TransactionSettings();
    this.swapComponent.appendChild(this.transactionModal);
    this.transactionModal.routerChanged = () => {
      const _isAPI = isAPI();
      if (this.uniswapAPI !== _isAPI) {
        this.uniswapAPI = _isAPI;
        this.handleAddRoute();
      }
    }
  }

  private showSettings() {
    this.transactionModal.showModal();
  }

  private async initData() {
    if (!this.isInited) {
      await this.initTokenSelection();
      await this.initApprovalModelAction();
      this.isInited = true;
    }
  }

  async init() {
    this.isReadyCallbackQueued = true;
    super.init();
    this.updateSwapButtonCaption();
    this.initAlert();
    this.initExpertModal();
    this.initTransactionSettings();
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      this.currentChainId = getChainId();
      const category = this.getAttribute('category', true, "fixed-pair");
      const providers = this.getAttribute('providers', true, []);
      const commissions = this.getAttribute('commissions', true, []);
      const tokens = this.getAttribute('tokens', true, []);
      const defaultChainId = this.getAttribute('defaultChainId', true);
      const networks = this.getAttribute('networks', true);
      const wallets = this.getAttribute('wallets', true);
      const showHeader = this.getAttribute('showHeader', true);
      await this.setData({ category, providers, commissions, tokens, defaultChainId, networks, wallets, showHeader });
    }
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
  }

  render() {
    return (
      <i-scom-dapp-container id="dappContainer">
        <i-panel id="swapComponent" background={{ color: Theme.background.main }}>
          <i-panel class="uniswap-v3">
            <i-panel id="swapContainer">
              <i-vstack horizontalAlignment="end" padding={{ right: 4 }}>
                <i-icon name="cog" width={20} height={20} fill={Theme.text.primary} class="pointer" onClick={this.showSettings} />
              </i-vstack>
              <i-panel margin={{ top: 8, bottom: 16 }} border={{ radius: 16 }}>
                <i-vstack gap={8} horizontalAlignment="center">
                  <i-vstack gap={5} minWidth={230} width="100%">
                    <i-panel class="token-box">
                      <i-vstack class="input--token-container" gap={8}>
                        <i-panel class="bg-box" background={{ color: Theme.input.background }} width="100%" padding={{ top: 12, bottom: 12, left: 16, right: 16 }} margin={{ top: 'auto' }}>
                          <i-hstack gap={10} class="input--token-box" verticalAlignment="center" horizontalAlignment="space-between" width="100%">
                            <i-vstack id="payCol">
                              <i-label caption="0" opacity={0.6} font={{ size: '1.5rem' }} />
                            </i-vstack>
                            <i-vstack>
                              <i-scom-uniswap-token-selection disableSelect={true} id="firstTokenSelection" />
                            </i-vstack>
                          </i-hstack>
                          <i-hstack gap={10} margin={{ top: 10 }} verticalAlignment="center" horizontalAlignment="space-between">
                            <i-label id="payUSD" font={{ color: Theme.text.primary }} opacity={0.6} />
                            <i-label id="payBalance" font={{ color: Theme.text.primary }} opacity={0.6} margin={{ left: 'auto' }} caption="Balance: 0" />
                          </i-hstack>
                        </i-panel>
                      </i-vstack>
                    </i-panel>
                  </i-vstack>
                  <i-panel class="toggle-reverse">
                    <i-icon
                      id="toggleReverseImage"
                      position="relative"
                      width={36}
                      height={36}
                      padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      class="icon-swap rounded-icon custom-ic--swap"
                      name="arrow-down"
                      onClick={this.onRevertSwap}
                    />
                  </i-panel>
                  <i-vstack gap={5} minWidth={230} width="100%">
                    <i-panel class="token-box" height="100%">
                      <i-vstack class="input--token-container" height="100%" gap={8}>
                        <i-panel class="bg-box" background={{ color: Theme.input.background }} width="100%" padding={{ top: 12, bottom: 12, left: 16, right: 16 }} margin={{ top: 'auto' }}>
                          <i-hstack gap={10} class="input--token-box" verticalAlignment="center" horizontalAlignment="space-between" width="100%">
                            <i-vstack id="receiveCol">
                              <i-label caption="0" opacity={0.6} font={{ size: '1.5rem' }} />
                            </i-vstack>
                            <i-vstack>
                              <i-scom-uniswap-token-selection disableSelect={true} id="secondTokenSelection" />
                            </i-vstack>
                          </i-hstack>
                          <i-hstack gap={10} margin={{ top: 10 }} verticalAlignment="center" horizontalAlignment="space-between">
                            <i-label id="receiveUSD" font={{ color: Theme.text.primary }} opacity={0.6} />
                            <i-label id="receiveBalance" font={{ color: Theme.text.primary }} opacity={0.6} margin={{ left: 'auto' }} caption="Balance: 0" />
                          </i-hstack>
                        </i-panel>
                      </i-vstack>
                    </i-panel>
                  </i-vstack>
                </i-vstack>
              </i-panel>
              <i-panel id="pnlPriceInfo" />
              <i-vstack class="swap-btn-container" horizontalAlignment="center" width="100%">
                <i-button
                  id="btnSwap"
                  class="btn-swap btn-os"
                  width="100%"
                  height={50}
                  // visible={false}
                  rightIcon={{ spin: true, visible: false, fill: Theme.colors.primary.contrastText }}
                  onClick={this.onClickSwapButton.bind(this)}
                />
              </i-vstack>
            </i-panel>
            <i-modal id="swapModal" class="custom-modal" title="Review Swap" closeIcon={{ name: 'times' }}>
              <i-label caption="You pay" opacity={0.8} />
              <i-hstack margin={{ top: 4, bottom: 4 }} verticalAlignment="center" wrap="wrap">
                <i-label id="fromTokenValue" font={{ size: '1.5rem', bold: true }} caption=" - " />
                <i-image id="fromTokenImage" width={36} height={36} fallbackUrl={tokenAssets.fallbackUrl} margin={{ left: 'auto' }} />
              </i-hstack>
              <i-label id="lbPayUSD" opacity={0.8} />

              <i-label caption="You receive" display="block" opacity={0.8} margin={{ top: 16 }} />
              <i-hstack margin={{ top: 4, bottom: 4 }} verticalAlignment="center" wrap="wrap">
                <i-label id="toTokenValue" font={{ size: '1.5rem', bold: true }} caption=" - " />
                <i-image id="toTokenImage" width={36} height={36} fallbackUrl={tokenAssets.fallbackUrl} margin={{ left: 'auto' }} />
              </i-hstack>
              <i-label id="lbReceiveUSD" opacity={0.8} />

              <i-panel width="100%" height={2} margin={{ top: 16, bottom: 16 }} background={{ color: Theme.input.background }} />
              <i-panel id="priceInfoContainer" margin={{ bottom: 20 }} class="bg-box" width="100%" />
              <i-panel class="swap-btn-container" width="100%">
                <i-button id="swapModalConfirmBtn" class="btn-swap btn-os" height={50} caption="Confirm Swap" onClick={this.doSwap} />
              </i-panel>
            </i-modal>
          </i-panel>
          <i-scom-commission-fee-setup id="configDApp" visible={false} />
          <i-scom-wallet-modal id="mdWallet" wallets={[]} />
        </i-panel>
      </i-scom-dapp-container>
    )
  }
}
