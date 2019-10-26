import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import libraFreeMarketIcon from './images/Libra-Freemarket-icon.png'
import Common from 'ethereumjs-common'

const EthereumTx = require('ethereumjs-tx').Transaction

class ItemEdit extends Component {
  
  constructor(props) {
    super(props);
      this.state = {
        loading: false,
        show: false,
        item: [],
      };
    this.handleEditItem = this.handleEditItem.bind(this);
    this.handleShowEditPage = this.handleShowEditPage.bind(this);
  }
  
  handleShowEditPage = async(item) => {
    console.log(item)
    this.setState({ 
      show: true,
      item: item,  
      id: item.id,
    })
  }

  handleEditItem = async() => {
    this.setState({ loading: true })
    // console.log(id)
    // console.log(itemName)
    // console.log(price)

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

    const functionAbi = await this.props.contract.methods.editItem(this.state.id, this.state.itemName, this.state.price).encodeABI()

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
              <div>
                <h3>商品リスト</h3>
                { this.props.myItems.map((item, key) => {
                  return (
                    <div className="card border-info text-black" key={key} >
                    <div className="card-header">
                    </div>
                    <div className="card-body">
                      <div className="card-text">
                        <p>{item.itemName}</p>
                        <p>価格：{item.price}</p>
                        <button className="btn btn-outline-primary" onClick={(event)=>{ this.handleShowEditPage(item) }}>編集</button>
                      </div>
                    </div>
                    <div className="card-footer"><small className="text-muted"> </small></div>
                  </div>
                  )
                })}
              </div>
              { this.state.show ? 
                <>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Item Name</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id="inputItemName" onChange={async(e) => await this.setState({ itemName : e.target.value })} defaultValue={this.state.item.itemName} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Item Price</label>
                    <div className="col-sm-10">
                      <input type="number" className="form-control" id="inputPrice" onChange={async(e) => await this.setState({ price : e.target.value })} defaultValue={this.state.item.price} />
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={(event)=>{ 
                      this.handleEditItem() 
                  }}>編集</button>
                </> : 
                <></> 
              }
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

export default ItemEdit;
