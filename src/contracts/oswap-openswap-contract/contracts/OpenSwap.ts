import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OpenSwap.json";
export interface IDeployParams {minter:string;initSupplyTo:string;initSupply:number|BigNumber;totalSupply:number|BigNumber}
export interface IAllowanceParams {owner:string;spender:string}
export interface IApproveParams {spender:string;amount:number|BigNumber}
export interface IDecreaseAllowanceParams {spender:string;subtractedValue:number|BigNumber}
export interface IIncreaseAllowanceParams {spender:string;addedValue:number|BigNumber}
export interface IMintParams {account:string;amount:number|BigNumber}
export interface ITransferParams {recipient:string;amount:number|BigNumber}
export interface ITransferFromParams {sender:string;recipient:string;amount:number|BigNumber}
export class OpenSwap extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.minter,params.initSupplyTo,this.wallet.utils.toString(params.initSupply),this.wallet.utils.toString(params.totalSupply)], options);
    }
    parseApprovalEvent(receipt: TransactionReceipt): OpenSwap.ApprovalEvent[]{
        return this.parseEvents(receipt, "Approval").map(e=>this.decodeApprovalEvent(e));
    }
    decodeApprovalEvent(event: Event): OpenSwap.ApprovalEvent{
        let result = event.data;
        return {
            owner: result.owner,
            spender: result.spender,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    parseTransferEvent(receipt: TransactionReceipt): OpenSwap.TransferEvent[]{
        return this.parseEvents(receipt, "Transfer").map(e=>this.decodeTransferEvent(e));
    }
    decodeTransferEvent(event: Event): OpenSwap.TransferEvent{
        let result = event.data;
        return {
            from: result.from,
            to: result.to,
            value: new BigNumber(result.value),
            _event: event
        };
    }
    allowance: {
        (params: IAllowanceParams, options?: TransactionOptions): Promise<BigNumber>;
    }
    approve: {
        (params: IApproveParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IApproveParams, options?: TransactionOptions) => Promise<boolean>;
        txData: (params: IApproveParams, options?: TransactionOptions) => Promise<string>;
    }
    balanceOf: {
        (account:string, options?: TransactionOptions): Promise<BigNumber>;
    }
    cap: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    decimals: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    decreaseAllowance: {
        (params: IDecreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IDecreaseAllowanceParams, options?: TransactionOptions) => Promise<boolean>;
        txData: (params: IDecreaseAllowanceParams, options?: TransactionOptions) => Promise<string>;
    }
    increaseAllowance: {
        (params: IIncreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IIncreaseAllowanceParams, options?: TransactionOptions) => Promise<boolean>;
        txData: (params: IIncreaseAllowanceParams, options?: TransactionOptions) => Promise<string>;
    }
    mint: {
        (params: IMintParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IMintParams, options?: TransactionOptions) => Promise<void>;
        txData: (params: IMintParams, options?: TransactionOptions) => Promise<string>;
    }
    minter: {
        (options?: TransactionOptions): Promise<string>;
    }
    name: {
        (options?: TransactionOptions): Promise<string>;
    }
    symbol: {
        (options?: TransactionOptions): Promise<string>;
    }
    totalSupply: {
        (options?: TransactionOptions): Promise<BigNumber>;
    }
    transfer: {
        (params: ITransferParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ITransferParams, options?: TransactionOptions) => Promise<boolean>;
        txData: (params: ITransferParams, options?: TransactionOptions) => Promise<string>;
    }
    transferFrom: {
        (params: ITransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: ITransferFromParams, options?: TransactionOptions) => Promise<boolean>;
        txData: (params: ITransferFromParams, options?: TransactionOptions) => Promise<string>;
    }
    private assign(){
        let allowanceParams = (params: IAllowanceParams) => [params.owner,params.spender];
        let allowance_call = async (params: IAllowanceParams, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('allowance',allowanceParams(params),options);
            return new BigNumber(result);
        }
        this.allowance = allowance_call
        let balanceOf_call = async (account:string, options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('balanceOf',[account],options);
            return new BigNumber(result);
        }
        this.balanceOf = balanceOf_call
        let cap_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('cap',[],options);
            return new BigNumber(result);
        }
        this.cap = cap_call
        let decimals_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('decimals',[],options);
            return new BigNumber(result);
        }
        this.decimals = decimals_call
        let minter_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('minter',[],options);
            return result;
        }
        this.minter = minter_call
        let name_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('name',[],options);
            return result;
        }
        this.name = name_call
        let symbol_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('symbol',[],options);
            return result;
        }
        this.symbol = symbol_call
        let totalSupply_call = async (options?: TransactionOptions): Promise<BigNumber> => {
            let result = await this.call('totalSupply',[],options);
            return new BigNumber(result);
        }
        this.totalSupply = totalSupply_call
        let approveParams = (params: IApproveParams) => [params.spender,this.wallet.utils.toString(params.amount)];
        let approve_send = async (params: IApproveParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('approve',approveParams(params),options);
            return result;
        }
        let approve_call = async (params: IApproveParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('approve',approveParams(params),options);
            return result;
        }
        let approve_txData = async (params: IApproveParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('approve',approveParams(params),options);
            return result;
        }
        this.approve = Object.assign(approve_send, {
            call:approve_call
            , txData:approve_txData
        });
        let decreaseAllowanceParams = (params: IDecreaseAllowanceParams) => [params.spender,this.wallet.utils.toString(params.subtractedValue)];
        let decreaseAllowance_send = async (params: IDecreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('decreaseAllowance',decreaseAllowanceParams(params),options);
            return result;
        }
        let decreaseAllowance_call = async (params: IDecreaseAllowanceParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('decreaseAllowance',decreaseAllowanceParams(params),options);
            return result;
        }
        let decreaseAllowance_txData = async (params: IDecreaseAllowanceParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('decreaseAllowance',decreaseAllowanceParams(params),options);
            return result;
        }
        this.decreaseAllowance = Object.assign(decreaseAllowance_send, {
            call:decreaseAllowance_call
            , txData:decreaseAllowance_txData
        });
        let increaseAllowanceParams = (params: IIncreaseAllowanceParams) => [params.spender,this.wallet.utils.toString(params.addedValue)];
        let increaseAllowance_send = async (params: IIncreaseAllowanceParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('increaseAllowance',increaseAllowanceParams(params),options);
            return result;
        }
        let increaseAllowance_call = async (params: IIncreaseAllowanceParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('increaseAllowance',increaseAllowanceParams(params),options);
            return result;
        }
        let increaseAllowance_txData = async (params: IIncreaseAllowanceParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('increaseAllowance',increaseAllowanceParams(params),options);
            return result;
        }
        this.increaseAllowance = Object.assign(increaseAllowance_send, {
            call:increaseAllowance_call
            , txData:increaseAllowance_txData
        });
        let mintParams = (params: IMintParams) => [params.account,this.wallet.utils.toString(params.amount)];
        let mint_send = async (params: IMintParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('mint',mintParams(params),options);
            return result;
        }
        let mint_call = async (params: IMintParams, options?: TransactionOptions): Promise<void> => {
            let result = await this.call('mint',mintParams(params),options);
            return;
        }
        let mint_txData = async (params: IMintParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('mint',mintParams(params),options);
            return result;
        }
        this.mint = Object.assign(mint_send, {
            call:mint_call
            , txData:mint_txData
        });
        let transferParams = (params: ITransferParams) => [params.recipient,this.wallet.utils.toString(params.amount)];
        let transfer_send = async (params: ITransferParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('transfer',transferParams(params),options);
            return result;
        }
        let transfer_call = async (params: ITransferParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('transfer',transferParams(params),options);
            return result;
        }
        let transfer_txData = async (params: ITransferParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('transfer',transferParams(params),options);
            return result;
        }
        this.transfer = Object.assign(transfer_send, {
            call:transfer_call
            , txData:transfer_txData
        });
        let transferFromParams = (params: ITransferFromParams) => [params.sender,params.recipient,this.wallet.utils.toString(params.amount)];
        let transferFrom_send = async (params: ITransferFromParams, options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('transferFrom',transferFromParams(params),options);
            return result;
        }
        let transferFrom_call = async (params: ITransferFromParams, options?: TransactionOptions): Promise<boolean> => {
            let result = await this.call('transferFrom',transferFromParams(params),options);
            return result;
        }
        let transferFrom_txData = async (params: ITransferFromParams, options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('transferFrom',transferFromParams(params),options);
            return result;
        }
        this.transferFrom = Object.assign(transferFrom_send, {
            call:transferFrom_call
            , txData:transferFrom_txData
        });
    }
}
export module OpenSwap{
    export interface ApprovalEvent {owner:string,spender:string,value:BigNumber,_event:Event}
    export interface TransferEvent {from:string,to:string,value:BigNumber,_event:Event}
}