declare module 'web3' {
  import * as BigNumber from 'bignumber.js'

  export interface JsonRPCRequest {
    jsonrpc: string;
    method: string;
    params: any[];
    id: number;
  }

  export interface JSONRPCRequestPayload {
    params: any[]
    method: string
    id: number
    jsonrpc: string
  }

  export interface JsonRPCResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
  }

  interface Callback<ResultType> {
    (error: Error): void;
    (error: null, val: ResultType): void;
  }

  export class Provider {
    send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): any;
  }


  type MixedData = string | number | object | any[] | BigNumber.BigNumber

  namespace Web3 {
    type ContractAbi = AbiDefinition[]

    type AbiDefinition = FunctionAbi | EventAbi

    type FunctionAbi = MethodAbi | ConstructorAbi | FallbackAbi

    enum AbiType {
      Function = 'function',
      Constructor = 'constructor',
      Event = 'event',
      Fallback = 'fallback'
    }

    interface MethodAbi {
      type: AbiType.Function
      name: string
      inputs: FunctionParameter[]
      outputs: FunctionParameter[]
      constant: boolean
      payable: boolean
    }

    interface ConstructorAbi {
      type: AbiType.Constructor
      inputs: FunctionParameter[]
      payable: boolean
    }

    interface FallbackAbi {
      type: AbiType.Fallback
      payable: boolean
    }

    interface EventParameter {
      name: string
      type: string
      indexed: boolean
    }

    interface EventAbi {
      type: AbiType.Event
      name: string
      inputs: EventParameter[]
      anonymous: boolean
    }

    interface FunctionParameter {
      name: string
      type: string
    }

    interface ContractInstance {
      address: string
      abi: ContractAbi
      [name: string]: any
    }
    export interface JsonRPCRequest {
      jsonrpc: string
      method: string
      params: any[]
      id: number
    }

    export interface JsonRPCResponse {
      jsonrpc: string
      id: number
      result?: any
      error?: string
    }

    interface Contract<A extends ContractInstance> {
      at (address: string): A
    }

    interface FilterObject {
      fromBlock?: number | string
      toBlock?: number | string
      address?: string
      topics?: LogTopic[]
    }

    type LogTopic = null | string | string[]

    interface SolidityEvent<A> {
      event: string
      address: string
      args: A
    }

    interface FilterResult {
      get (callback: () => void): void
      watch<A> (callback: (err: Error, result: SolidityEvent<A>) => void): void
      stopWatching (callback: () => void): void
    }

    export interface JSONRPCRequestPayload {
      params: any[]
      method: string
      id: number
      jsonrpc: string
    }

    export interface JSONRPCResponsePayload {
      result: any
      id: number
      jsonrpc: string
    }

    export interface Provider {
      sendAsync (
        payload: JSONRPCRequestPayload,
        callback: (err: Error, result: JsonRPCResponse) => void
      ): void
    }

    interface Sha3Options {
      encoding: 'hex'
    }

    interface EthApi {
      coinbase: string
      mining: boolean
      hashrate: number
      gasPrice: BigNumber.BigNumber
      accounts: string[]
      blockNumber: number
      defaultAccount: string
      defaultBlock: BlockParam
      syncing: SyncingResult
      compile: {
        solidity (sourceString: string, cb?: (err: Error, result: any) => void): object
      }
      getMining (cd: (err: Error, mining: boolean) => void): void
      getHashrate (cd: (err: Error, hashrate: number) => void): void
      getGasPrice (cd: (err: Error, gasPrice: BigNumber.BigNumber) => void): void
      getAccounts (cd: (err: Error, accounts: string[]) => void): void
      getBlockNumber (callback: (err: Error, blockNumber: number) => void): void
      getSyncing (cd: (err: Error, syncing: SyncingResult) => void): void
      isSyncing (cb: (err: Error, isSyncing: boolean, syncingState: SyncingState) => void): IsSyncing

      getBlock (hashStringOrBlockNumber: string | BlockParam): BlockWithoutTransactionData
      getBlock (hashStringOrBlockNumber: string | BlockParam,
                callback: (err: Error, blockObj: BlockWithoutTransactionData) => void): void
      getBlock (hashStringOrBlockNumber: string | BlockParam,
                returnTransactionObjects: true): BlockWithTransactionData
      getBlock (hashStringOrBlockNumber: string | BlockParam, returnTransactionObjects: true,
                callback: (err: Error, blockObj: BlockWithTransactionData) => void): void

      getBlockTransactionCount (hashStringOrBlockNumber: string | BlockParam): number
      getBlockTransactionCount (hashStringOrBlockNumber: string | BlockParam,
                                callback: (err: Error, blockTransactionCount: number) => void): void

      // TODO returnTransactionObjects
      getUncle (hashStringOrBlockNumber: string | BlockParam,
                uncleNumber: number): BlockWithoutTransactionData
      getUncle (hashStringOrBlockNumber: string | BlockParam, uncleNumber: number,
                callback: (err: Error, uncle: BlockWithoutTransactionData) => void): void

      getTransaction (transactionHash: string): Transaction
      getTransaction (transactionHash: string,
                      callback: (err: Error, transaction: Transaction) => void): void

      getTransactionFromBlock (hashStringOrBlockNumber: string | BlockParam,
                               indexNumber: number): Transaction
      getTransactionFromBlock (hashStringOrBlockNumber: string | BlockParam, indexNumber: number,
                               callback: (err: Error, transaction: Transaction) => void): void

      contract (abi: ContractAbi): Contract<any>

      // TODO block param
      getBalance (addressHexString: string): BigNumber.BigNumber
      getBalance (addressHexString: string, callback: (err: Error, result: BigNumber.BigNumber) => void): void

      // TODO block param
      getStorageAt (address: string, position: number): string
      getStorageAt (address: string, position: number, callback: (err: Error, storage: string) => void): void

      // TODO block param
      getCode (addressHexString: string): string
      getCode (addressHexString: string, callback: (err: Error, code: string) => void): void

      filter (value: string | FilterObject): FilterResult

      sendTransaction (txData: TxData): string
      sendTransaction (txData: TxData, callback: (err: Error, value: string) => void): void

      sendRawTransaction (rawTxData: string): string
      sendRawTransaction (rawTxData: string, callback: (err: Error, value: string) => void): void

      sign (address: string, data: string): string
      sign (address: string, data: string, callback: (err: Error, signature: string) => void): void

      getTransactionReceipt (txHash: string): TransactionReceipt
      getTransactionReceipt (txHash: string,
                             callback: (err: Error, receipt: TransactionReceipt) => void): void

      // TODO block param
      call (callData: CallData): string
      call (callData: CallData, callback: (err: Error, result: string) => void): void

      estimateGas (callData: CallData): string
      estimateGas (callData: CallData, callback: (err: Error, gas: string) => void): void

      // TODO defaultBlock
      getTransactionCount (address: string): number
      getTransactionCount (address: string, callback: (err: Error, count: number) => void): void
    }

    interface VersionApi {
      api: string
      network: string
      node: string
      ethereum: string
      whisper: string
      getNetwork (cd: (err: Error, networkId: string) => void): void
      getNode (cd: (err: Error, nodeVersion: string) => void): void
      getEthereum (cd: (err: Error, ethereum: string) => void): void
      getWhisper (cd: (err: Error, whisper: string) => void): void
    }

    interface PersonalApi {
      listAccounts: string[] | undefined
      newAccount (password?: string): string
      unlockAccount (address: string, password?: string, duration?: number): boolean
      lockAccount (address: string): boolean
      sign (message: string, account: string, password: string): string
      sign (hexMessage: string, account: string, callback: (error: Error, signature: string) => void): void
    }

    interface NetApi {
      listening: boolean
      peerCount: boolean
      getListening (cd: (err: Error, listening: boolean) => void): void
      getPeerCount (cd: (err: Error, peerCount: number) => void): void
    }

    type BlockParam = number | 'earliest' | 'latest' | 'pending'

    type Unit = 'kwei' | 'ada' | 'mwei' | 'babbage' | 'gwei' | 'shannon' | 'szabo' | 'finney' |
      'ether' | 'kether' | 'grand' | 'einstein' | 'mether' | 'gether' | 'tether'

    interface SyncingState {
      startingBlock: number
      currentBlock: number
      highestBlock: number
    }
    type SyncingResult = false | SyncingState

    interface IsSyncing {
      addCallback (cb: (err: Error, isSyncing: boolean, syncingState: SyncingState) => void): void
      stopWatching (): void
    }

    interface AbstractBlock {
      number: number | null
      hash: string | null
      parentHash: string
      nonce: string | null
      sha3Uncles: string
      logsBloom: string | null
      transactionsRoot: string
      stateRoot: string
      miner: string
      difficulty: BigNumber.BigNumber
      totalDifficulty: BigNumber.BigNumber
      extraData: string
      size: number
      gasLimit: number
      gasUser: number
      timestamp: number
      uncles: string[]
    }
    interface BlockWithoutTransactionData extends AbstractBlock {
      transactions: string[]
    }
    interface BlockWithTransactionData extends AbstractBlock {
      transactions: Transaction[]
    }

    interface Transaction {
      hash: string
      nonce: number
      blockHash: string | null
      blockNumber: number | null
      transactionIndex: number | null
      from: string
      to: string | null
      value: BigNumber.BigNumber
      gasPrice: BigNumber.BigNumber
      gas: number
      input: string
    }

    interface CallTxDataBase {
      to?: string
      value?: number | string | BigNumber.BigNumber
      gas?: number | string | BigNumber.BigNumber
      gasPrice?: number | string | BigNumber.BigNumber
      data?: string
      nonce?: number
    }

    interface TxData extends CallTxDataBase {
      from: string
    }

    interface CallData extends CallTxDataBase {
      from?: string
    }

    interface TransactionReceipt {
      blockHash: string
      blockNumber: number
      transactionHash: string
      transactionIndex: number
      from: string
      to: string
      cumulativeGasUsed: number
      gasUsed: number
      contractAddress: string | null
      logs: LogEntry[]
    }

    interface LogEntry {
      logIndex: number | null
      transactionIndex: number
      transactionHash: string
      blockHash: string | null
      blockNumber: number | null
      address: string
      data: string
      topics: string[]
    }
  }

  namespace providers {
    export class HttpProvider implements Web3.Provider {
      constructor (url?: string, timeout?: number, username?: string, password?: string);
      public sendAsync (
        payload: Web3.JSONRPCRequestPayload,
        callback: (err: Error, result: Web3.JSONRPCResponsePayload) => void
      ): void
      public send (
        payload: Web3.JSONRPCRequestPayload,
        callback: (err: Error, result: Web3.JSONRPCResponsePayload) => void
      ): void
    }
  }

  class Web3 {
    public static providers: typeof providers
    public currentProvider: Web3.Provider

    public eth: Web3.EthApi
    public personal: Web3.PersonalApi | undefined
    public version: Web3.VersionApi
    public net: Web3.NetApi

    public constructor (provider?: Web3.Provider);
    public constructor (endpoint: string);

    public isConnected (): boolean
    public setProvider (provider: Web3.Provider): void
    public reset (keepIsSyncing: boolean): void
    public toHex (data: MixedData): string
    public toAscii (hex: string): string
    public fromAscii (ascii: string, padding?: number): string
    public toDecimal (hex: string): number
    public fromDecimal (value: number | string): string
    public fromWei (value: number | string, unit: Web3.Unit): string
    public fromWei (value: BigNumber.BigNumber, unit: Web3.Unit): BigNumber.BigNumber
    public toWei (amount: number | string, unit: Web3.Unit): string
    public toWei (amount: BigNumber.BigNumber, unit: Web3.Unit): BigNumber.BigNumber
    public toBigNumber (value: number | string): BigNumber.BigNumber
    public isAddress (address: string): boolean
    public isChecksumAddress (address: string): boolean
    public sha3 (value: string, options?: Web3.Sha3Options): string
  }

  export default Web3
}
