import {IWallet, Contract as _Contract, Transaction, TransactionReceipt, BigNumber, Event, IBatchRequestObj, TransactionOptions} from "@ijstech/eth-contract";
import Bin from "./OSWAP_VotingExecutor3.json";
export interface IDeployParams {governance:string;factory:string;hybridRegistry:string}
export class OSWAP_VotingExecutor3 extends _Contract{
    static _abi: any = Bin.abi;
    constructor(wallet: IWallet, address?: string){
        super(wallet, address, Bin.abi, Bin.bytecode);
        this.assign()
    }
    deploy(params: IDeployParams, options?: TransactionOptions): Promise<string>{
        return this.__deploy([params.governance,params.factory,params.hybridRegistry], options);
    }
    execute: {
        (params:string[], options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params:string[], options?: TransactionOptions) => Promise<void>;
        txData: (params:string[], options?: TransactionOptions) => Promise<string>;
    }
    factory: {
        (options?: TransactionOptions): Promise<string>;
    }
    governance: {
        (options?: TransactionOptions): Promise<string>;
    }
    hybridRegistry: {
        (options?: TransactionOptions): Promise<string>;
    }
    private assign(){
        let factory_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('factory',[],options);
            return result;
        }
        this.factory = factory_call
        let governance_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('governance',[],options);
            return result;
        }
        this.governance = governance_call
        let hybridRegistry_call = async (options?: TransactionOptions): Promise<string> => {
            let result = await this.call('hybridRegistry',[],options);
            return result;
        }
        this.hybridRegistry = hybridRegistry_call
        let execute_send = async (params:string[], options?: TransactionOptions): Promise<TransactionReceipt> => {
            let result = await this.send('execute',[this.wallet.utils.stringToBytes32(params)],options);
            return result;
        }
        let execute_call = async (params:string[], options?: TransactionOptions): Promise<void> => {
            let result = await this.call('execute',[this.wallet.utils.stringToBytes32(params)],options);
            return;
        }
        let execute_txData = async (params:string[], options?: TransactionOptions): Promise<string> => {
            let result = await this.txData('execute',[this.wallet.utils.stringToBytes32(params)],options);
            return result;
        }
        this.execute = Object.assign(execute_send, {
            call:execute_call
            , txData:execute_txData
        });
    }
}