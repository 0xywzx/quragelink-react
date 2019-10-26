import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import libraFreeMarketIcon from './images/Libra-Freemarket-icon.png'
import Common from 'ethereumjs-common'
import Web3 from 'web3'


const EthereumTx = require('ethereumjs-tx').Transaction

class ContractDeploy extends Component {
  componentWillMount() {
  }
  
  constructor(props) {
    super(props);
      this.state = {

      };
    this.handleSetValue = this.handlePostItem.bind(this);
    this.sample = this.sample.bind(this);
    this.sampleShow = this.sampleShow.bind(this);
  }
  
  handlePostItem = async() => {

    // Contract deploy with ether address
    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'privatechain',
        networkId: 1515,
        chainId: 1515,
      },
      'petersburg',
    )
    
    await console.log(this.props.etherAccount)
    const decryptEtherAccount = await this.props.web3.eth.accounts.decrypt(this.props.etherAccount,'test!')
    await console.log(decryptEtherAccount)

    const privatekey = await Buffer.from(decryptEtherAccount.privateKey.slice(2), 'hex', )

    const bytecode = "0x608060405234801561001057600080fd5b506040516020806101408339810180604052602081101561003057600080fd5b8101908080519060200190929190505050806000819055505060e9806100576000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c8063822a634a146041578063c412eaba14606c578063ca6158cb146088575b600080fd5b606a60048036036020811015605557600080fd5b810190808035906020019092919050505060a4565b005b607260ae565b6040518082815260200191505060405180910390f35b608e60b7565b6040518082815260200191505060405180910390f35b8060008190555050565b60008054905090565b6000548156fea165627a7a723058207942a879e753640985945a1fc5ac2fb685daaae7c7dec98582b4a34a960ab0b20029"
    var itemContract = new this.props.web3.eth.Contract([{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"setItem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getItem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"itemId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"id","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);

    const hexdata = itemContract.deploy({
      data: bytecode,
      arguments:[1]
    }).encodeABI()

    const nonceHex = await this.props.web3.utils.toHex(this.props.nonce);
    const gasPriceHex = await this.props.web3.utils.toHex(0);
    const gasLimitHex = this.props.web3.utils.toHex(500000);

    var details = await {
      nonce : nonceHex,
      gasPrice : gasPriceHex,
      gasLimit: gasLimitHex,
      from : decryptEtherAccount.address,
      data : hexdata,
    };

    const transaction = await new EthereumTx(details, { common: customCommon },);

    await transaction.sign(privatekey)
    console.log(transaction)

    var rawdata = await '0x' + transaction.serialize().toString('hex');
    console.log(rawdata)

    await this.props.web3.eth.sendSignedTransaction(rawdata)
    .on('transactionHash', function(hash){
      console.log(['transferToStaging Trx Hash:' + hash]);
    })
    .on('receipt', function(receipt){
      console.log(['transferToStaging Receipt:', receipt]);
      console.log(['contract address:', receipt.contractAddress]);
    })
    .on('error', console.error);

    //////// Deploy with node my using contract.deploy
    
    // const node = "0x0c238156efaa9bad4b63a97bbea2d68d4ba773cc"
    // await this.props.web3.eth.personal.unlockAccount(node, "ywzx", 1000, async () => {
    //   await itemContract.deploy({
    //     data: bytecode,
    //     arguments:[1]
    //   })
    //   .send({
    //     from: node,
    //     gas: 0,
    //     gasPrice: '0',
    //   }).on('error', (error) => {
    //       console.log("Error: ", error);
    //   }).on('transactionHash', (transactionHash) => {
    //       console.log("TxHash: ", transactionHash);
    //   }).on('receipt', (receipt) => {
    //     console.log("Address: ", receipt.contractAddress)
    //   }).then((newContractInstance) => {
    //       console.log(newContractInstance);   
    //   }).catch(function(error) {
    //       console.log(error);
    //   });
    // })
  }

  sample = async () => {
    const abi = [{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"setItem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getItem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"itemId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"id","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
    const web3 = await new Web3(new Web3.providers.HttpProvider('http://0.0.0.0:8545'))
    const contractAddress = "0x5d2ad6ac317a613bd189d6f37b4799c637bcd9c1"
    const contract = await new web3.eth.Contract(abi, contractAddress)

    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'privatechain',
        networkId: 1515,
        chainId: 1515,
      },
      'petersburg',
    )

    await console.log(this.props.etherAccount)
    const decryptEtherAccount = await this.props.web3.eth.accounts.decrypt(this.props.etherAccount,'test!')
    await console.log(decryptEtherAccount)

    const privatekey = await Buffer.from(decryptEtherAccount.privateKey.slice(2), 'hex', )

    const functionAbi = await contract.methods.setItem(5).encodeABI()

    var details = await {
      nonce : this.props.nonce,
      gasPrice : 0,
      gasLimit: 500000,
      from : decryptEtherAccount.address,
      to : contractAddress,
      data : functionAbi,
    };

    const transaction = await new EthereumTx(details, { common: customCommon },);

    await transaction.sign(privatekey)
    console.log(transaction)

    var rawdata = await '0x' + transaction.serialize().toString('hex');
    console.log(rawdata)

    await this.props.web3.eth.sendSignedTransaction(rawdata)
    .on('transactionHash', function(hash){
      console.log(['transferToStaging Trx Hash:' + hash]);
    })
    .on('receipt', function(receipt){
      console.log(['transferToStaging Receipt:', receipt]);
    })
    .on('error', console.error);
  }

  sampleShow = async () => {
    const abi = [{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"setItem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getItem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"itemId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"id","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
    const web3 = await new Web3(new Web3.providers.HttpProvider('http://0.0.0.0:8545'))
    const contractAddress = "0x5d2ad6ac317a613bd189d6f37b4799c637bcd9c1"
    const contract = await new web3.eth.Contract(abi, contractAddress)
    const sm = await contract.methods.getItem().call()
    await console.log(sm)
  }
 
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="icon-header">
              <img className="libraFreeMarketIcon" src={libraFreeMarketIcon} alt="libraFreeMarketIcon" />
            </div>
            <div className="create-user">
              <p>商品名：
                <input type="text" onChange={async(e) => await this.setState({ itemName : e.target.value })} />
              </p>
              <p>価格：
                <input type="number" onChange={async(e) => await this.setState({ price : Number(e.target.value) })} />
              </p>
              <button className="btn btn-outline-primary" onClick={this.handlePostItem}>商品登録</button>
              <button className="btn btn-outline-primary" onClick={this.sample}>Sample</button>
              <button className="btn btn-outline-primary" onClick={this.sampleShow}>SampleShow</button>
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

export default ContractDeploy;
