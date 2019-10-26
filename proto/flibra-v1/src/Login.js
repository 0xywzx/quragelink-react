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
    this.handleLogin = this.handleLogin.bind(this);
  }
  
  handleLogin = async() => {
    this.setState({ loading: true })
    await this.props.login(this.state.mnemonic)
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
              { this.state.loading ? 
                <p> loading ....</p> 
                : 
                <>
                  <h2 className="title-text">Log in</h2>
                  <br/>
                  <p>Linraアカウントを作成した際に表示された、24個の単語（mnemonic）を入力してください。</p>
                  <input className="text-mnemonic" type="text" onChange={async(e) => await this.setState({ mnemonic : e.target.value })} />
                  <br/>
                  <button className="btn btn-outline-primary" onClick={this.handleLogin}>Login</button>
                </>    
              }
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

export default CreateUser;
