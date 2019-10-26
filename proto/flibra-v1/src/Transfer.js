import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import libraFreeMarketIcon from './images/Libra-Freemarket-icon.png'

class Transfer extends Component {
  
  constructor(props) {
    super(props);
      this.state = {
        loading: false,
      };
    this.handleTransfer = this.handleTransfer.bind(this);
  }
  
  handleTransfer = async() => {
    this.setState({ loading: true })
    await this.props.transfer(this.state.address, this.state.amount)
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
                  <h2 className="title-text">Transfer Libra Coin</h2>
                  <br/>
                  <p>
                    送信額：<input type="number" onChange={async(e) => await this.setState({ amount : e.target.value })} />
                  </p>
                  <p>
                    送信先：<input type="text" onChange={async(e) => await this.setState({ address : e.target.value })} />
                  </p>
                  <br/>
                  <button className="btn btn-outline-primary" onClick={this.handleTransfer}>送信</button>
                </>    
              }
            </div>    
          </div>
        </div>
      </div>
    );
  }
}

export default Transfer;
