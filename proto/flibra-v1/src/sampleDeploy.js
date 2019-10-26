handlePostItem = async() => {

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

    // const hexdata = itemContract.deploy({
    //   data: bytecode,
    //   arguments:[1]
    // }).encodeABI()

    // const nonceHex = await this.props.web3.utils.toHex(this.props.nonce);
    // const gasPriceHex = await this.props.web3.utils.toHex(0);
    // const gasLimitHex = this.props.web3.utils.toHex(500000);

    // var details = await {
    //   nonce : nonceHex,
    //   gasPrice : gasPriceHex,
    //   gasLimit: gasLimitHex,
    //   from : decryptEtherAccount.address,
    //   data : "0x"+hexdata,
    // };

    // const transaction = await new EthereumTx(details, { common: customCommon },);

    // await transaction.sign(privatekey)
    // console.log(transaction)

    // var rawdata = await '0x' + transaction.serialize().toString('hex');
    // console.log(rawdata)

    // await this.props.web3.eth.sendSignedTransaction(rawdata)
    // .on('transactionHash', function(hash){
    //   console.log(['transferToStaging Trx Hash:' + hash]);
    // })
    // .on('receipt', function(receipt){
    //   console.log(['transferToStaging Receipt:', receipt]);
    // })
    // .on('error', console.error);

    // With metamask
    // console.log(this.state.account)
    // const greet = await this.state.contract.methods.setGreeting(this.state.text).send({ from: this.state.account })

  //   //await console.log(this.props.web3.eth.getAccount())
  //   //await this.props.web3.personal.importRawKey(privatekey, 'test!')
   
    // const node = "0x0c238156efaa9bad4b63a97bbea2d68d4ba773cc"
    // await this.props.web3.eth.personal.unlockAccount(node, "ywzx", 1000, () => {
      
      const acts = await this.props.web3.eth.getAccounts()
      await itemContract.deploy({
        data: bytecode,
        arguments:[1]
      })
      .send({
        from: acts[1],
        gas: 1500000,
        gasPrice: '30000000000000',
      }).on('error', (error) => {
          console.log("Error: ", error);
      }).on('transactionHash', (transactionHash) => {
          console.log("TxHash: ", transactionHash);
      }).on('receipt', (receipt) => {
        console.log("Address: ", receipt.contractAddress)
      }).then((newContractInstance) => {
          console.log(newContractInstance);   
      }).catch(function(error) {
          console.log(error);
      });
 
    // })
  }

  sample = async () => {
    const abi = [{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"setItem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getItem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"itemId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"id","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
    const web3 = await new Web3(new Web3.providers.HttpProvider('http://0.0.0.0:7545'))
    const contractAddress = "0x4489feC40D523d73f59845dF799a7C8ab212DC56"
    const contract = await new web3.eth.Contract(abi, contractAddress)
    console.log(contract)

    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'privatechain',
        networkId: 1515,
        chainId: 1515,
      },
      'petersburg',
    )

    const privatekey = await Buffer.from("39e563ecb6fe3f7f39af47e8e181248345072af8d7d0aed9a3f406bc7c3ac314", 'hex', )

    const functionAbi = await contract.methods.setItem(5).encodeABI()

    const acts1 = await web3.eth.getAccounts()
    console.log(acts1[0])
    const nonce = await web3.eth.getTransactionCount(acts1[0])
    console.log(nonce)

    var details = await {
      nonce : nonce,
      gasPrice : 15000,
      gasLimit: 500000,
      from : acts1[0],
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
    const web3 = await new Web3(new Web3.providers.HttpProvider('http://0.0.0.0:7545'))
    const contractAddress = "0x4489feC40D523d73f59845dF799a7C8ab212DC56"
    const contract = await new web3.eth.Contract(abi, contractAddress)
    const sm = await contract.methods.getItem().call()
    await console.log(sm)
  }
