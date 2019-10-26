import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import libraFreeMarketIcon from './images/Libra-Freemarket-icon.png'
import Common from 'ethereumjs-common'

const EthereumTx = require('ethereumjs-tx').Transaction

class App extends Component {
  componentWillMount() {
  }
  
  constructor(props) {
    super(props);
      this.state = {

      };
    this.handleSetValue = this.handlePostItem.bind(this);
  }
  
  handlePostItem = async() => {

    // Without Metamask
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

    const functionAbi = await this.props.contract.methods.setItem(this.state.itemName, this.state.price).encodeABI()

    var details = await {
      nonce : this.props.nonce,
      gasPrice : 0,
      gasLimit: 500000,
      from : decryptEtherAccount.address,
      to : this.props.contractAddress,
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

    // With metamask
    // console.log(this.state.account)
    // const greet = await this.state.contract.methods.setGreeting(this.state.text).send({ from: this.state.account })
    
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
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

export default App;
