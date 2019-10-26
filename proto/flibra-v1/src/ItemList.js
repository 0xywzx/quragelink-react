import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import libraFreeMarketIcon from './images/Libra-Freemarket-icon.png'
import Common from 'ethereumjs-common'

const EthereumTx = require('ethereumjs-tx').Transaction

class ItemList extends Component {
  
  constructor(props) {
    super(props);
      this.state = {
      };
  }
  
  handlePurchaseItem = async(itemId) => {
    this.setState({ loading: true })

    // Transfer libra coin
    // await this.props.transfer(this.state.address, this.state.amount)

    // Send tx to privatechain Without Metamask
    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'privatechain',
        networkId: 1515,
        chainId: 1515,
      },
      'petersburg',
    )
    await console.log(itemId)
    await console.log(this.props.etherAccount)
    const decryptEtherAccount = await this.props.web3.eth.accounts.decrypt(this.props.etherAccount,'test!')
    await console.log(decryptEtherAccount)

    const privatekey = await Buffer.from(decryptEtherAccount.privateKey.slice(2), 'hex', )

    const functionAbi = await this.props.contract.methods.purchaseItem(itemId).encodeABI()

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

    this.setState({ loading: false })
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
              <h3>商品リスト</h3>
              { this.props.onSaleItems.map((item, key) => {
                return (
                  <div className="card border-info text-black" key={key} >
                  <div className="card-header">
                  </div>
                  <div className="card-body">
                    <div className="card-text">
                      <p>{item.itemName}</p>
                      <p>価格：{item.price}</p>
                      { item.selling ? <p>selling</p> : <p>sold out</p> }
                      <p>{item.selling}</p>
                      <button className="btn btn-outline-primary" onClick={(event)=>{ this.handlePurchaseItem(item.id) }}>購入</button>
                    </div>
                  </div>
                  <div className="card-footer"><small className="text-muted"> </small></div>
                </div>
                )
              })}
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

export default ItemList;
