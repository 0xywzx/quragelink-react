# f Libra

## Build fLibra private chain

### Set up Geth

Install ethereum
```
brew tap ethereum/ethereum
brew install ethereum
```

Make `flibrachain` directory, and create a geth account for development

```
$ geth account new --datadir ./flibrachain/node1
```
```
NFO [12-20|11:37:00.688] Maximum peer count                       ETH=25 LES=0 total=25
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase:
Repeat passphrase:
Address: {4d8c003c1dc28a28a323873752e2b07c2cf3d413}
```

### Generate the genecis block

```
$ cd flibrachain
$ puppeth
```

Set a network name. In this case, I named "flibrachain"
```
Please specify a network name to administer (no spaces, hyphens or capital letters please)
>flibrachain
```

Type "2" to generate new genecis block. 
```
What would you like to do? (default = stats)
 1. Show network stats
 2. Configure new genesis
 3. Track new remote server
 4. Deploy network components
> 2
```

Type "1".
```
What would you like to do? (default = create)
 1. Create new genesis from scratch
 2. Import already existing genesis
> 1
```

Type "2" to choose PoA consensus algorithm.
```
Which consensus engine to use? (default = clique)
1. Ethash - proof-of-work
2. Clique - proof-of-authority
> 2
```

```
How many seconds should blocks take? (default = 15)
> 5
```

Type the address that you created before, and press enter twice.
```
Which accounts are allowed to seal? (mandatory at least one)
> 0x4d8c003c1dc28a28a323873752e2b07c2cf3d413
> 0x
```

Again
```
Which accounts should be pre-funded? (advisable at least one)
> 0x4d8c003c1dc28a28a323873752e2b07c2cf3d413
> 0x
```

```
Should the precompile-addresses (0x1 .. 0xff) be pre-funded with 1 wei? (advisable yes)
> yes
```

Type network id. 
```
Specify your chain/network ID if you want an explicit one (default = random)
>1515
```

Next, type "2" to manage genecis block.
```
What would you like to do? (default = stats)
1. Show network stats
2. Manage existing genesis
3. Track new remote server
4. Deploy network components
> 2
```

Then, export information of genesis block
```
 1. Modify existing fork rules
 2. Export genesis configurations
 3. Remove genesis configuration
> 2
```

If you don't mind where those will be save, press enter.
```
Which folder to save the genesis specs into? (default = current)
  Will create flibrachain/.json, flibrachain/-aleth.json, flibrachain/-harmony.json, flibrachain/-parity.json
>
```

```
IINFO [12-20|22:54:03.661] Saved native genesis chain spec          path=privateconsortium.json
ERROR[12-20|22:54:03.662] Failed to create Aleth chain spec        err="unsupported consensus engine"
ERROR[12-20|22:54:03.662] Failed to create Parity chain spec       err="unsupported consensus engine"
INFO [12-20|22:54:03.663] Saved genesis chain spec                 client=harmony path=privateconsortium-harmony.json
```

### Start a network

Initialize a node.

```
$ cd flibrachain
$ geth --datadir node1 init flibrachain.json
```

Start up geth

```
geth --datadir node1/ --syncmode 'full' --port 30311 --rpc --rpcaddr '0.0.0.0' --rpcport 8545 --rpccorsdomain "*" --rpcvhosts "*" --rpcapi 'personal,db,eth,net,web3,txpool,miner'  --networkid 1515 --gasprice '0'
```

In another terminal, start mining to build blockchain

```
$ cd flibrachain
$ geth attach ipc:node1/geth.ipc
Welcome to the Geth JavaScript console!
```

Unlock your account
```
> personal.unlockAccount(eth.coinbase,"Password",0)
true
```

Set default account
```
> eth.defaultAccount = eth.coinbase
0x4d8c003c1dc28a28a323873752e2b07c2cf3d413
```

Start mining
```
> miner.start()
null
```

You can see how many blocks blockchain has like this.
```
eth.blockNumber
```

## Deploy contract to block chain

I recommend you to use `node v11.14.0` and `npm 6.7.0`

```
$ nvm install 11.14.0
$ nvm use  11.14.0
Now using node v11.14.0 (npm v6.7.0)
```

Clone the project and install dependencies
```
$ git clone 
$ cd flibra-v1
$ npm i
```

Deploy contract to private chain
```
$ truffle console --network local 
truffle(local)> migrate --reset
```

## Run the app

```
$ npm start
```
