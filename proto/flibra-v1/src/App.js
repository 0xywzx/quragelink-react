import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios';
import Web3 from 'web3'
import Contract from './abis/FLibra.json'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CreateUser from './CreateUser.js'
import Login from './Login.js'
import Transfer from './Transfer.js'
import User from './User.js'
import ItemPost from './ItemPost.js'
import ItemList from './ItemList.js'
import ItemEdit from './ItemEdit.js'
import ContractDeploy from './ContractDeploy.js'


class App extends Component {
  componentWillMount() {
    this.loadChainData()
  }

  async loadChainData() {
    const web3 = await new Web3(new Web3.providers.HttpProvider('http://0.0.0.0:8545')) // with metamask Web3(Web3.givenProvider || 'http://0.0.0.0:8545') 
    const networkId = await web3.eth.net.getId()
    const contract = await new web3.eth.Contract(Contract.abi, Contract.networks[networkId].address)
    this.setState({ 
      web3: web3,
      contractAddress: Contract.networks[networkId].address,
      contract: contract,
    })
    this.loadWalletData()
  }

  async loadWalletData() {
    // load libra wallet 
    let address = sessionStorage.getItem('address');
    if (address !== undefined) {
      const walletBalance = await axios.post(`http://localhost:3005/getBalance`, { address: address }) 
      this.setState({ 
        userAddress: address,
        balance: walletBalance.data.balance 
      })
      console.log(walletBalance.data.balance)
    }

    // load ether account 
    let etherAccount = JSON.parse(sessionStorage.getItem('etherAccout'))
    let etherAddress = sessionStorage.getItem('etherAddress')
    if (etherAddress !== null) {
      this.state.web3.eth.defaultAccount = etherAccount.address
      const nonce = await this.state.web3.eth.getTransactionCount(this.state.web3.eth.defaultAccount)
      this.setState({ 
        etherAccount: etherAccount,
        etherAddress: etherAddress.slice(1, -1),
        nonce: nonce,
      })
    }
    this.loadData()
  }

  async loadData() {
    if (this.state.etherAddress !== undefined ) {
      // Get My Posted Items
      const myItemId = await this.state.contract.methods.getMyItemId(this.state.etherAddress).call()
      for ( var i = 0 ; i < myItemId.length; i++ ) {
        const myItem = await this.state.contract.methods.getMyItem(myItemId[i]).call()
        //console.log(myItem)
        this.setState({
          myItems: [...this.state.myItems, myItem]
        })
      }

      // Get My Purchaed Items
      const myPurchaedItemId = await this.state.contract.methods.getMyPurchasedItemId(this.state.etherAddress).call()
      for ( var j = 0 ; j < myPurchaedItemId.length; j++ ) {
        const myPurchaedItem = await this.state.contract.methods.getMyPurchasedItem(myPurchaedItemId[j]).call()
        console.log(myPurchaedItem)
        this.setState({
          myPurchaedItems: [...this.state.myPurchaedItems, myPurchaedItem]
        })
      }        
      
      // Get Review Info
      for ( var l = 0 ; l < myItemId.length; l++ ) {
        // textで振り分け
        // List of Review to Purchaser
        const writeReviewToPurchaser = await this.state.contract.methods.getPurchaserReview(myItemId[l]).call()
        this.setState({
          writeReviewsToPurchaser: [...this.state.writeReviewsToPurchaser, writeReviewToPurchaser]
        })

        // My Review as Seller
        const myReviewAsSeller = await this.state.contract.methods.getSellerReview(myItemId[l]).call()
        if (myReviewAsSeller.text !== "") {
          this.setState({
            myReviewsAsSeller: [...this.state.myReviewsAsSeller, myReviewAsSeller]
          })
        }
      }

      for ( var m = 0 ; m < myPurchaedItemId.length; m++ ) {
        // List of Review to Seller
        const writeReviewToSeller = await this.state.contract.methods.getSellerReview(myPurchaedItemId[m]).call()
        this.setState({
          writeReviewsToSeller: [...this.state.writeReviewsToSeller, writeReviewToSeller]
        })

        // My Review as Purchaser
        const purchaserReview = await this.state.contract.methods.getPurchaserReview(myPurchaedItemId[m]).call()
        if (purchaserReview.text !== 0) {
          this.setState({
            myReviewsAsPurchaser: [...this.state.myReviewsAsPurchaser, purchaserReview]
          })
        }
      }

    }
    
    // Get All On Sale Items
    const numberOfItem = await this.state.contract.methods.getNumberOfItem().call()
    if (numberOfItem > 0 ) {
      this.setState.onSaleItems = []
      for ( var k = 0; k < numberOfItem; k++ ) {
        const item = await this.state.contract.methods.getItemOnSale(k).call()
        console.log(item)
        if (item.selling === Boolean("true")) {
          this.setState({
            onSaleItems: [...this.state.onSaleItems, item]
          })
        }
      }
    }

  }

  constructor(props) {
    super(props);
      this.state = {
        mnemonic: '',
        balance: '',
        userAddress: '',
        onSaleItems: [],
        myItems: [],
        myPurchaedItems: [],
        writeReviewsToPurchaser: [],
        writeReviewsToSeller: [],
        myReviewsAsSeller: [],
        myReviewsAsPurchaser: [],
      };
    this.createWallet = this.createWallet.bind(this);
    this.login = this.login.bind(this);
    this.transfer = this.transfer.bind(this);
  }
  
  createWallet = async() => {
    // Generate account libra account 
    console.log("creating libra wallet...")
    const createWallet = await axios.post(`http://localhost:3005/createWallet`)
    console.log(createWallet)
    this.setState({ 
      userAddress: createWallet.data.address,
      balance: createWallet.data.balance,
      mnemonic: createWallet.data.mnemonic,
    })
  }

  login = async(mnemonic) => {
    // Gettting libra account address
    console.log("Gettting libra account address from mnemonic phrase")
    const address = await axios.post(`http://localhost:3005/login`, {
      mnemonic: mnemonic
    })
    await sessionStorage.setItem('mnemonic', mnemonic)
    await sessionStorage.setItem('address', address.data.address)
    console.log("Libra account address is ", address.data.address)

    // Gettting ether account address
    console.log("Gettting ether account address from mnemonic phrase")
    const pkUtils = require('./mnemonic-privatekey-utils')
    const privateKeyEther = pkUtils.getPrivateKeyFromMnemonic(mnemonic)
    // const etherAccount = await this.state.web3.eth.accounts.privateKeyToAccount(privateKeyEther)
    const encryptPrivateKey = await this.state.web3.eth.accounts.encrypt(privateKeyEther, 'test!')
    const decryptEtherAccount = await this.state.web3.eth.accounts.decrypt(encryptPrivateKey, 'test!')
    await sessionStorage.setItem('etherAddress', JSON.stringify(decryptEtherAccount.address))
    await console.log("Ether account address is ", decryptEtherAccount.address)
    const encryptEtherAccount = await this.state.web3.eth.accounts.encrypt(decryptEtherAccount.privateKey, 'test!')
    await sessionStorage.setItem('etherAccout', JSON.stringify(encryptEtherAccount))
  }

  transfer = async(toAddress, amount) => {
    let mnemonic = sessionStorage.getItem('mnemonic');
    let address = sessionStorage.getItem('address');
    await axios.post(`http://localhost:3005/transfer`, { 
      fromAddress: address,
      mnemonic: mnemonic,
      toAddress: toAddress,
      amount: amount 
    })
  }

  render() {
    return (
      <>
        <Tab.Container defaultActiveKey="second">
          <Row className="body-container">
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Guidline</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">新規作成</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">Login画面</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="forth">マイページ</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="fifth">Transfer</Nav.Link>
                </Nav.Item> 
                <Nav.Item>
                  <Nav.Link eventKey="sixth">商品投稿</Nav.Link>
                </Nav.Item>  
                <Nav.Item>
                  <Nav.Link eventKey="seventh">商品一覧</Nav.Link>
                </Nav.Item> 
                <Nav.Item>
                  <Nav.Link eventKey="eighth">商品編集</Nav.Link>
                </Nav.Item> 
                <Nav.Item>
                  <Nav.Link eventKey="nineth">コントラクトデプロイ</Nav.Link>
                </Nav.Item>  
              </Nav>
            </Col>             
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <CreateUser 
                      createWallet = {this.createWallet} 
                      mnemonic = {this.state.mnemonic}
                      userAddress = {this.state.userAddress}
                      resetLocalData = {this.resetLocalData} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">    
                    <Login 
                      login = {this.login} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="forth"> 
                    <User 
                      web3 = {this.state.web3}
                      contract = {this.state.contract}
                      nonce = {this.state.nonce}
                      contractAddress = {this.state.contractAddress}
                      etherAccount = {this.state.etherAccount}
                      userAddress = {this.state.userAddress}
                      etherAddress = {this.state.etherAddress}
                      balance = {this.state.balance}
                      myItems = {this.state.myItems}
                      myPurchaedItems = {this.state.myPurchaedItems}
                      writeReviewsToPurchaser = {this.state.writeReviewsToPurchaser}
                      writeReviewsToSeller = {this.state.writeReviewsToSeller}
                      myReviewsAsSeller = {this.state.myReviewsAsSeller}
                      myReviewsAsPurchaser = {this.state.myReviewsAsPurchaser} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="fifth">
                    <Transfer 
                      transfer = {this.transfer}/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="sixth">
                    <ItemPost
                      web3 = {this.state.web3}
                      contract = {this.state.contract}
                      nonce = {this.state.nonce}
                      contractAddress = {this.state.contractAddress}
                      etherAccount = {this.state.etherAccount} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="seventh">
                    <ItemList
                      onSaleItems = {this.state.onSaleItems}
                      web3 = {this.state.web3}
                      contract = {this.state.contract}
                      nonce = {this.state.nonce}
                      contractAddress = {this.state.contractAddress}
                      etherAccount = {this.state.etherAccount}
                      transfer = {this.transfer} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="eighth">
                    <ItemEdit
                      web3 = {this.state.web3}
                      contract = {this.state.contract}
                      nonce = {this.state.nonce}
                      contractAddress = {this.state.contractAddress}
                      etherAccount = {this.state.etherAccount}
                      myItems = {this.state.myItems} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="nineth">
                    <ContractDeploy
                      web3 = {this.state.web3}
                      contract = {this.state.contract}
                      nonce = {this.state.nonce}
                      contractAddress = {this.state.contractAddress}
                      etherAccount = {this.state.etherAccount} />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
          </Row>
        </Tab.Container>
      </>
    );
  }
}

export default App;
