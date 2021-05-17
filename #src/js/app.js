const App = {
	// var
	web3: null,
	account: 0x0,
	contracts: {
		MyContract: null
	},


	// constructor
	init: async function ()
	{
		// connect WEB3, set "this.account"
		await this.init_WEB_3()
		// CHECK ERRORS : request metamask to plug on some accounts
		if (this.account === undefined) {
			this.request_WALLET()
			return
		}
		
		
		// conenct CONTRACT, set "this.contracts.MyContract"
		await this.init_CONTRACT()
		// CHECK ERRORS : request metamask to be connected to contrat network
		if (this.contracts.MyContract === null) {
			this.request_NETWORK()
			return
		}

		// render the page if all requirements are met
		await this.render()


		// subscribe for contract events
		this.subscribe_EVENTS()
	},


	// subscribe to contract events
	subscribe_EVENTS: function ()
	{
		// subscribe for sell event
		/*
		this.contracts.MyContract.events
			.Sell({})
			.on('data', async (event) => { this.render() })
		*/
	},


	// get web3 provider
	init_WEB_3: async function ()
	{
		const _provider = (typeof web3 !== 'undefined')
			? window.ethereum
			: new Web3.providers.HttpProvider('http://localhost:7545')

		this.web3 = await new Web3(_provider);

		[this.account] = await this.web3.eth.getAccounts()

		// conversion functions
		const that = this

		const hex_f = function( ) { return that.web3.utils.toHex(this.valueOf()) }
		const wei_f = function(u) { return that.web3.utils.toWei(this.valueOf().toString(), u) }
		const eth_f = function(u) { return that.web3.utils.fromWei(this.valueOf().toString(), u) }
		const poi_f = function( ) { return this.valueOf().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }

		Number.prototype.toETH = eth_f; String.prototype.toETH = eth_f
		Number.prototype.toWEI = wei_f;	String.prototype.toWEI = wei_f
		Number.prototype.toHEX = hex_f;	String.prototype.toHEX = hex_f
		Number.prototype.toPOI = poi_f;	String.prototype.toPOI = poi_f
	},


	// create contract instance
	init_CONTRACT: async function ()
	{
		this.contracts.MyContract = await this.read_CONTRACT('MyContract.json')
	},

	read_CONTRACT: async function (file)
	{
		// request ABI and current wallet network
		const { abi: _abi, networks: _networks } = await this.getJSON(file)
		const _network = await this.web3.eth.net.getId()

		// check if contract exists in the network which wallet is connected to
		if (!_networks[_network])
			return null

		return new this.web3.eth.Contract(_abi, _networks[_network].address)
	},


	// request wallet if it is not connected to website
	request_WALLET: function ()
	{
		this.web3.eth.requestAccounts()

		console.log('requesting wallet to be required');
		// show HTML error requesting wallet to be required
	},
	
	// request correct network
	request_NETWORK: function ()
	{
		console.log('requesting correct network to be required');
		// show HTML error requesting correct network to be required
	},


	// render the page
	render: async function ()
	{
		// var
		//await this.contracts.Token.methods.transfer(_address, _amount).send({ from: this.account })
		//const [_tokenBalance] = await this.handle(this.contracts.MyContract.methods.balanceOf(this.account).call())

		// render HTML
		console.log('succssess');
	},


	// system functions
	handle: promise =>
	{
		return promise
			.then(data => [data, null])
			.catch(err => [null,  err])
	},

	getJSON: async function (url)
	{
		let response = await fetch(url)
		let data = await response.json()
		return data
	},

	id: function (selector)
	{
		const elem = document.querySelectorAll(selector)

		for (let i = 0; i < elem.length; i++)
		{
			const el = elem[i]

			el.css	  = (s) => { if (s) el.setAttribute('style', s); else el.removeAttribute('style') }
			el.html   = (h) => { el.innerHTML = h }
			el.hide   = ()  => { el.style.display = 'none' }
			el.show   = ()  => { el.style.display = '' }
			el.val 	  = ()  => { return el.value }
			el.empty  = ()  => { while (el.firstChild) el.removeChild(el.firstChild) }
			el.append = (h) => { el.insertAdjacentHTML('beforeend', h); }
		}

		return elem.length === 1 ? elem[0] : elem;
	}
}

// initialize page
document.addEventListener('DOMContentLoaded', () => { App.init() })