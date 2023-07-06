import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_OracleLiquidityProvider.json";
export interface IDeployParams {factory:string;WETH:string}
export interface IAddLiquidityParams {tokenA:string;tokenB:string;addingTokenA:boolean;staked:number|BigNumber;afterIndex:number|BigNumber;amountIn:number|BigNumber;expire:number|BigNumber;enable:boolean;deadline:number|BigNumber}
export interface IAddLiquidityETHParams {tokenA:string;addingTokenA:boolean;staked:number|BigNumber;afterIndex:number|BigNumber;amountAIn:number|BigNumber;expire:number|BigNumber;enable:boolean;deadline:number|BigNumber}
export interface IRemoveAllLiquidityParams {tokenA:string;tokenB:string;to:string;deadline:number|BigNumber}
export interface IRemoveAllLiquidityETHParams {tokenA:string;to:string;deadline:number|BigNumber}
export interface IRemoveLiquidityParams {tokenA:string;tokenB:string;removingTokenA:boolean;to:string;unstake:number|BigNumber;afterIndex:number|BigNumber;amountOut:number|BigNumber;reserveOut:number|BigNumber;expire:number|BigNumber;enable:boolean;deadline:number|BigNumber}
export interface IRemoveLiquidityETHParams {tokenA:string;removingTokenA:boolean;to:string;unstake:number|BigNumber;afterIndex:number|BigNumber;amountOut:number|BigNumber;reserveOut:number|BigNumber;expire:number|BigNumber;enable:boolean;deadline:number|BigNumber}
export class OSWAP_OracleLiquidityProvider extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.factory,params.WETH], options);
    }
    WETH: {
        (options?: TransactionOptions): Promise<string>;
    }
    addLiquidity: {
        (params: IAddLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IAddLiquidityParams, options?: TransactionOptions) => Promise<BigNumber>;
        txData: (params: IAddLiquidityParams, options?: TransactionOptions) => Promise<string>;
    }
    addLiquidityETH: {
        (params: IAddLiquidityETHParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IAddLiquidityETHParams, options?: number|BigNumber|TransactionOptions) => Promise<BigNumber>;
        txData: (params: IAddLiquidityETHParams, options?: number|BigNumber|TransactionOptions) => Promise<string>;
    }
    factory: {
        (options?: TransactionOptions): Promise<string>;
    }
    govToken: {
        (options?: TransactionOptions): Promise<string>;
    }
    removeAllLiquidity: {
        (params: IRemoveAllLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRemoveAllLiquidityParams, options?: TransactionOptions) => Promise<{amountA:BigNumber,amountB:BigNumber}>;
        txData: (params: IRemoveAllLiquidityParams, options?: TransactionOptions) => Promise<string>;
    }
    removeAllLiquidityETH: {
        (params: IRemoveAllLiquidityETHParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRemoveAllLiquidityETHParams, options?: TransactionOptions) => Promise<{amountToken:BigNumber,amountETH:BigNumber}>;
        txData: (params: IRemoveAllLiquidityETHParams, options?: TransactionOptions) => Promise<string>;
    }
    removeLiquidity: {
        (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRemoveLiquidityParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRemoveLiquidityParams, options?: TransactionOptions) => Promise<string>;
    }
    removeLiquidityETH: {
        (params: IRemoveLiquidityETHParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IRemoveLiquidityETHParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IRemoveLiquidityETHParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let WETH_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('WETH',[],options);
            return result;
        }
        this.WETH = WETH_call
        let factory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('factory',[],options);
            return result;
        }
        this.factory = factory_call
        let govToken_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('govToken',[],options);
            return result;
        }
        this.govToken = govToken_call
        let addLiquidityParams = (params: IAddLiquidityParams) => [params.tokenA,params.tokenB,params.addingTokenA,this.wallet.utils.toString(params.staked),this.wallet.utils.toString(params.afterIndex),this.wallet.utils.toString(params.amountIn),this.wallet.utils.toString(params.expire),params.enable,this.wallet.utils.toString(params.deadline)];
        let addLiquidity_send = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('addLiquidity',addLiquidityParams(params),options);
            return result;
        }
        let addLiquidity_call = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('addLiquidity',addLiquidityParams(params),options);
            return new BigNumber(result);
        }
        let addLiquidity_txData = async (params: IAddLiquidityParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('addLiquidity',addLiquidityParams(params),options);
            return result;
        }
        this.addLiquidity = Object.assign(addLiquidity_send, {
            call:addLiquidity_call
            , txData:addLiquidity_txData
        });
        let addLiquidityETHParams = (params: IAddLiquidityETHParams) => [params.tokenA,params.addingTokenA,this.wallet.utils.toString(params.staked),this.wallet.utils.toString(params.afterIndex),this.wallet.utils.toString(params.amountAIn),this.wallet.utils.toString(params.expire),params.enable,this.wallet.utils.toString(params.deadline)];
        let addLiquidityETH_send = async (params: IAddLiquidityETHParams, options?: number|BigNumber|TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('addLiquidityETH',addLiquidityETHParams(params),options);
            return result;
        }
        let addLiquidityETH_call = async (params: IAddLiquidityETHParams, options?: number|BigNumber|TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('addLiquidityETH',addLiquidityETHParams(params),options);
            return new BigNumber(result);
        }
        let addLiquidityETH_txData = async (params: IAddLiquidityETHParams, options?: number|BigNumber|TransactionOptions): Promise<string> => {
            let result = await this.txData('addLiquidityETH',addLiquidityETHParams(params),options);
            return result;
        }
        this.addLiquidityETH = Object.assign(addLiquidityETH_send, {
            call:addLiquidityETH_call
            , txData:addLiquidityETH_txData
        });
        let removeAllLiquidityParams = (params: IRemoveAllLiquidityParams) => [params.tokenA,params.tokenB,params.to,this.wallet.utils.toString(params.deadline)];
        let removeAllLiquidity_send = async (params: IRemoveAllLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('removeAllLiquidity',removeAllLiquidityParams(params),options);
            return result;
        }
        let removeAllLiquidity_call = async (params: IRemoveAllLiquidityParams, options?: TransactionOptions): Promise<{amountA:BigNumber,amountB:BigNumber}> => {
            let result = await this.call('removeAllLiquidity',removeAllLiquidityParams(params),options);
            return {
                amountA: new BigNumber(result.amountA),
                amountB: new BigNumber(result.amountB)
            };
        }
        let removeAllLiquidity_txData = async (params: IRemoveAllLiquidityParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('removeAllLiquidity',removeAllLiquidityParams(params),options);
            return result;
        }
        this.removeAllLiquidity = Object.assign(removeAllLiquidity_send, {
            call:removeAllLiquidity_call
            , txData:removeAllLiquidity_txData
        });
        let removeAllLiquidityETHParams = (params: IRemoveAllLiquidityETHParams) => [params.tokenA,params.to,this.wallet.utils.toString(params.deadline)];
        let removeAllLiquidityETH_send = async (params: IRemoveAllLiquidityETHParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('removeAllLiquidityETH',removeAllLiquidityETHParams(params),options);
            return result;
        }
        let removeAllLiquidityETH_call = async (params: IRemoveAllLiquidityETHParams, options?: TransactionOptions): Promise<{amountToken:BigNumber,amountETH:BigNumber}> => {
            let result = await this.call('removeAllLiquidityETH',removeAllLiquidityETHParams(params),options);
            return {
                amountToken: new BigNumber(result.amountToken),
                amountETH: new BigNumber(result.amountETH)
            };
        }
        let removeAllLiquidityETH_txData = async (params: IRemoveAllLiquidityETHParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('removeAllLiquidityETH',removeAllLiquidityETHParams(params),options);
            return result;
        }
        this.removeAllLiquidityETH = Object.assign(removeAllLiquidityETH_send, {
            call:removeAllLiquidityETH_call
            , txData:removeAllLiquidityETH_txData
        });
        let removeLiquidityParams = (params: IRemoveLiquidityParams) => [params.tokenA,params.tokenB,params.removingTokenA,params.to,this.wallet.utils.toString(params.unstake),this.wallet.utils.toString(params.afterIndex),this.wallet.utils.toString(params.amountOut),this.wallet.utils.toString(params.reserveOut),this.wallet.utils.toString(params.expire),params.enable,this.wallet.utils.toString(params.deadline)];
        let removeLiquidity_send = async (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('removeLiquidity',removeLiquidityParams(params),options);
            return result;
        }
        let removeLiquidity_call = async (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('removeLiquidity',removeLiquidityParams(params),options);
            return;
        }
        let removeLiquidity_txData = async (params: IRemoveLiquidityParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('removeLiquidity',removeLiquidityParams(params),options);
            return result;
        }
        this.removeLiquidity = Object.assign(removeLiquidity_send, {
            call:removeLiquidity_call
            , txData:removeLiquidity_txData
        });
        let removeLiquidityETHParams = (params: IRemoveLiquidityETHParams) => [params.tokenA,params.removingTokenA,params.to,this.wallet.utils.toString(params.unstake),this.wallet.utils.toString(params.afterIndex),this.wallet.utils.toString(params.amountOut),this.wallet.utils.toString(params.reserveOut),this.wallet.utils.toString(params.expire),params.enable,this.wallet.utils.toString(params.deadline)];
        let removeLiquidityETH_send = async (params: IRemoveLiquidityETHParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('removeLiquidityETH',removeLiquidityETHParams(params),options);
            return result;
        }
        let removeLiquidityETH_call = async (params: IRemoveLiquidityETHParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('removeLiquidityETH',removeLiquidityETHParams(params),options);
            return;
        }
        let removeLiquidityETH_txData = async (params: IRemoveLiquidityETHParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('removeLiquidityETH',removeLiquidityETHParams(params),options);
            return result;
        }
        this.removeLiquidityETH = Object.assign(removeLiquidityETH_send, {
            call:removeLiquidityETH_call
            , txData:removeLiquidityETH_txData
        });
    }
}