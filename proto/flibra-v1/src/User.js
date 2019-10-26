import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import libraFreeMarketIcon from './images/Libra-Freemarket-icon.png'
import Common from 'ethereumjs-common'

const EthereumTx = require('ethereumjs-tx').Transaction

class User extends Component {
  
  constructor(props) {
    super(props);
      this.state = {
        loading: false,
        showReviewForm: false,
      };
    this.handleWriteReview = this.handleWriteReview.bind(this);
    this.handleShowReviewForm = this.handleShowReviewForm.bind(this);

  }
  
  handleShowReviewForm = async(id) => {
    this.setState({ 
      id: id,
      showReviewForm: true,
    })
  }

  // createUserInfo = async() => {

  // }

  handleWriteReview = async() => {
    this.setState({ loading: true })

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

    const functionAbi = await this.props.contract.methods.writeReviewToSeller(this.state.id, this.state.star, this.state.text).encodeABI()

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
                <p className="small">ログインしたあと、一回ページをリロードすると表示されます</p>
                <p>Libra アドレス：{this.props.userAddress} </p>
                <p>残高：{this.props.balance} </p>
                <br/>
                <p>Ether アドレス：{this.props.etherAddress}</p>
                <br/>
              </div>
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
                        { item.selling === Boolean("") ? <>
                          { this.props.writeReviewsToPurchaser[key] === undefined ? 
                            <></> :
                            <>
                              { this.props.writeReviewsToPurchaser[key].text === "" ?
                                <button className="btn btn-outline-primary" onClick={(event)=>{ this.handleShowReviewForm(item.id) }}>SellerにReviewを書く</button> :
                                <></>
                              }
                            </>
                          }
                        </> : <>
                          <span>On sale</span>
                        </>}
                      </div>
                    </div>
                    <div className="card-footer"><small className="text-muted"> </small></div>
                  </div>
                  )
                })}
              </div>
              <div>
                <h3>購入履歴</h3>
                { this.props.myPurchaedItems.map((item, key) => {
                  return (
                    <div className="card border-info text-black" key={key} >
                    <div className="card-header">
                    </div>
                    <div className="card-body">
                      <div className="card-text">
                        <p>{item.itemName}</p>
                        <p>価格：{item.price}</p>
                        <p>販売元：{item.seller}</p>
                        { this.props.writeReviewsToSeller[key] === undefined ? 
                          <></> :
                          <>
                            { this.props.writeReviewsToSeller[key].text === "" ?
                              <button className="btn btn-outline-primary" onClick={(event)=>{ this.handleShowReviewForm(item.id) }}>SellerにReviewを書く</button> :
                              <></>
                            }
                          </>
                        }
                      </div>
                    </div>
                    <div className="card-footer"><small className="text-muted"> </small></div>
                  </div>
                  )
                })}
              </div>
              <div>
                { this.state.showReviewForm ? 
                  <>
                    <h3>Reviewを書く</h3>
                      <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Star</label>
                        <div className="col-sm-10">
                          <input type="number" max="4" className="form-control" id="inputStar" onChange={async(e) => await this.setState({ star : e.target.value })} placeholder="0 - 10" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Text</label>
                        <div className="col-sm-10">
                          <input type="text" className="form-control" id="inputText" onChange={async(e) => await this.setState({ text : e.target.value })} placeholder="Please write a review." />
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline-primary" 
                        onClick={(event)=>{ 
                          this.handleWriteReview() 
                      }}>ポストする</button>
                    </> : <>
                  </>
                }                
              </div>
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

export default User;
