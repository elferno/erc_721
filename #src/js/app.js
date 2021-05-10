const App = {
	// var
	web3: null,
	account: 0x0,
	contracts: {
		Token	 : null,
		TokenSale: null
	},


	// constructor
	init: async function ()
	{
		await this.init_WEB_3()
		await this.init_CONTRACT()
		await this.render()
	},


	// get web3 provider
	init_WEB_3: async function ()
	{
		const _provider = (typeof web3 !== 'undefined')
			? window.ethereum
			: new Web3.providers.HttpProvider('http://localhost:7545')

		this.web3 = await new Web3(_provider);

		[this.account] = await this.web3.eth.getAccounts()

		if (this.account === undefined) {
			// request metamask to plug on some accounts
			this.web3.eth.requestAccounts()
		} else {
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
		}
	},


	// create contract instance
	init_CONTRACT: async function ()
	{
		this.contracts.Token = await this.read_CONTRACT('Token.json')
		this.contracts.TokenSale = await this.read_CONTRACT('TokenSale.json')
	},

	read_CONTRACT: async function (file)
	{
		const { abi: _abi, networks: _networks } = await this.getJSON(file)
		const _address = _networks[Object.keys(_networks)[0]].address
		return new this.web3.eth.Contract(_abi, _address)
	},


	// render the page
	render: async function ()
	{
		// var
		//await this.contracts.Token.methods.transfer(this.contracts.TokenSale.options.address, 750000).send({ from: this.account })

		const _tokenBalance = await this.contracts.Token.methods.balanceOf(this.account).call()

		const _TokenSellAddress = this.contracts.TokenSale.options.address
		const _price 	  = await this.contracts.TokenSale.methods.token_Price().call()
		const _soldTokens = await this.contracts.TokenSale.methods.token_Sold().call()
		const _leftTokens = await this.contracts.Token.methods.balanceOf(_TokenSellAddress).call()

		// render
		this.id('.your-account').html(this.account)

		this.id('.token-price').html(_price.toETH())
		this.id('.token-amount').html(_tokenBalance.toPOI())

		this.id('.token-sold').html(_soldTokens.toPOI())
		this.id('.token-total').html((+_leftTokens + +_soldTokens).toPOI())
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

			el.style 	= (s) => { if (s) el.setAttribute('style', s); else el.removeAttribute('style') }
			el.html 	= (h) => { el.innerHTML = h }
			el.hide 	= ()  => { el.style.display = 'none' }
			el.show 	= ()  => { el.style.display = '' }
			el.val 		= ()  => { return el.value }
			el.empty	= ()  => { while (el.firstChild) el.removeChild(el.firstChild) }
			el.append	= (h) => { el.insertAdjacentHTML('beforeend', h); }
		}

		return elem.length === 1 ? elem[0] : elem;
	}
}

// initialize page
document.addEventListener('DOMContentLoaded', () => { App.init() })