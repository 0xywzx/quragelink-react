import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import libraFreeMarketIcon from './images/Libra-Freemarket-icon.png'

class CreateUser extends Component {
  
  constructor(props) {
    super(props);
      this.state = {
        loading: false,
        userAddress: ''
      };
    this.handleCreateWallet = this.handleCreateWallet.bind(this);
  }
  
  handleCreateWallet = async() => {
    this.setState({ loading: true })
    await this.props.createWallet()
    this.setState({ loading: false })
  }

  handleDeleteWallet = async() => {
    
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
              { this.state.loading ? 
                <p>creating wallet ....</p> 
                : 
                <>
                  <h2 className="title-text">新規作成</h2>
                  <br/>
                  <p>Libraアカウントを発行する</p>
                  <button className="btn btn-outline-info" onClick={this.handleCreateWallet}>作成する</button>
                </>    
              }
              { this.props.mnemonic !== ''  ? 
                <>
                  <br/>
                  <div className="localData">
                    <h2>Wallet 情報</h2>
                    <p>MnemonicはLoginする際に必要になります。大切に保管しておいてください。<br/>
                      現在、メモをとり終えたら削除しましょう。
                    </p>
                    <p>Address</p> 
                    <p>{this.props.userAddress}</p>
                    <p>Mnemonic</p> 
                    <p className="mnemonic">{this.props.mnemonic}</p> 
                    <button className="btn btn-outline-info" onClick={this.handleDeleteWallet}>削除する</button>
                  </div>
                </> : <></> }
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

export default CreateUser;
