// after contract deployed
const Web3 = require('web3')
const Provider = require('@truffle/hdwallet-provider')
const Contract_DATA = require('./abi/ColorBubble.json')

// from https://vanity-eth.tk/ OR from ganache client
const address = '0xEDA478eB1B6b3aE4Ee40FFCCC23054C423B46f30'
const privateKey = '799750af48aea8f5be897730e6d4a3cf9c55434bd17087db3eb919f61d22ef11'

const address1 = '0x850f86B16064fe4040afBfB727e1439907104eA0'
const privateKey1 = '5ae658f16687b5c33d21476648d64fb0fec42470306cf6721a01ab42b6f05667'

// use infura for real devop: https://ropsten.infura.io/v3/08d71244b6cb4b46bdfb7b27898f4cfb
const server = 'HTTP://127.0.0.1:7545'

// implementation
const init = async (_color) => {
	/* @@@@@@@@@ SEND ETHER @@@@@@@@@ */
	// connect web3
	const web3 = new Web3(server)


	// get network ID
	const network_ID = await web3.eth.net.getId()


	// create contract instance
	const contract = new web3.eth
		.Contract(
			Contract_DATA.abi,
			Contract_DATA.networks[network_ID].address,
		)

	// 1. build transaction
	const nonce = await web3.eth.getTransactionCount(address)

	const block = await web3.eth.getBlock('latest')
	const gas = block.gasLimit
	const gasPrice = await web3.eth.getGasPrice()
	txCost = +web3.utils.fromWei((gas * gasPrice).toString())

	value = web3.utils.toWei((1).toString(), 'ether')

	console.log(block.transactions.length);

	const txParams = {
		to : address1,
		value,
		gas,
		gasPrice,
		nonce,
		chainId: network_ID
	}

	// 2. sign it
	const signed_TX = await web3.eth.accounts.signTransaction(
		txParams,
		privateKey
		)


	// 3. broadcast to blockchain
	const transaction = await web3.eth.sendSignedTransaction(signed_TX.rawTransaction)
	

	// 4. get transaction from blockchain
	const tx_data = await web3.eth.getTransaction(transaction.transactionHash)
	console.log(tx_data);
	/* @@@@@@@@@ SEND ETHER @@@@@@@@@ */



	/* @@@@@@@@@ CALL CONTRACT FUNCION @@@@@@@@@ *
	// connect web3
		const provider = new Provider(privateKey, server)
		const web3 = new Web3(provider)


		// get network ID
		const network_ID = await web3.eth.net.getId()


		// create contract instance
		const contract = new web3.eth
			.Contract(
				Contract_DATA.abi,
				Contract_DATA.networks[network_ID].address,
			)

	// call contract function
	const value = web3.utils.toWei((1).toString(), 'ether');
	const tx_data = await contract.methods.mint(_color).send({from: address, value})
	console.log(tx_data);
	/* @@@@@@@@@ CALL CONTRACT FUNCION @@@@@@@@@ */
}

init('FF000F')