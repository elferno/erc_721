const App = {
	// var
	web3: null,
	account: 0x0,
	contracts: {
		ColorBubble: null
	},
	html: {},
	handling: false,


	// constructor
	init: async function ()
	{
		// collect all HTML elements
		// set on click events
		this.define_HTML();

		// connect WEB3, set "this.account"
		await this.init_WEB_3()
		// CHECK ERRORS : request metamask to plug on some accounts
		if (this.account === undefined) {
			this.request_WALLET()
			return
		}
		
		
		// conenct CONTRACT, set "this.contracts.ColorBubble"
		await this.init_CONTRACT()
		// CHECK ERRORS : request metamask to be connected to contrat network
		if (this.contracts.ColorBubble === null) {
			this.request_NETWORK()
			return
		}

		// render the page if all requirements are met
		await this.render()


		// subscribe for contract events
		this.subscribe_EVENTS()
	},
	
	
	// colelct'n'save all HTML elements we're gonna need
	define_HTML: function ()
	{
		this.html = {
			content: this.id('.content'),
			tokens: this.id('.tokens'),
			participate: this.id('#participate'),
		}

		this.html.participate.addEventListener('click', () => { this.mint() })
	},


	// awaiting for delayed pay
	set_AWAIT: async function ()
	{
		const _color = this.id('#color').val()
		
		await this.contracts.ColorBubble.methods
			.await( _color )
			.send ( {from: this.account} )
	},
	
	check_AWAIT: async function ()
	{
			const _await = await this.contracts.ColorBubble.methods
			.checkAwait()
			.call ( {from: this.account} )

		console.log(_await)
	},


	// mint token with color
	mint: async function ()
	{
		if (!this.handling) {
			// var
			const _color = this.id('#color').val()

			// amination
			this.set_HANDLING(true)

			// fire mint
			await this.contracts.ColorBubble.methods
				.mint(_color)
				.send({
					from: this.account,
					value: (1).toWEI('ether')
				})

			//
			this.handling = false
		}
	},
	
	set_HANDLING: function (_handling)
	{
		const _css =
			_handling
				? 'opacity: .5; cursor: default; box-shadow: none;'
				: ''

		this.handling = _handling
		this.html.participate.css(_css)
	},


	// subscribe to contract events
	subscribe_EVENTS: function ()
	{
		// subscribe for sell event
		
		this.contracts.ColorBubble.events
			.Transfer({})
			.on('data', async (event) => {
				if (event.returnValues.from === '0x0000000000000000000000000000000000000000')
					this.render()
			})
		
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
		this.contracts.ColorBubble = await this.read_CONTRACT('abi/ColorBubble.json')
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

		this.html.content.html('<span>please connect your browser wallet<br>and reload the page</span>')
		this.html.content.css('opacity: 1;')
	},
	
	// request correct network
	request_NETWORK: function ()
	{
		this.html.content.html('<span>please connect your browser wallet to correct network<br>and reload the page</span>')
		this.html.content.css('opacity: 1;')
	},


	// render the page
	render: async function ()
	{
		// var
		const _totalSupply = await this.contracts.ColorBubble.methods.totalSupply().call()

		// render HTML
		this.set_HANDLING(false)
		this.html.content.css('opacity: 1;')

		this.id('.header_right-side').html(`Your address: ${this.account}`)
		this.id('#wallet').value = this.account
		this.id('#color').value = Math.floor(Math.random() * 16777215).toString(16)

		for (let i = 0; i < _totalSupply; i++) {
			const _color = await this.contracts.ColorBubble.methods.colors(i).call()
			const _owner = await this.contracts.ColorBubble.methods.ownerOf(i + 1).call()

			this.html.tokens.append(this.insert_TOKEN(_color, _owner === this.account))
		}
	},


	// insert HTML token
	insert_TOKEN: function (_color, _owner)
	{
		// if token already inserted in HTML - skip it
		if (this.id(`#token_${_color}`) !== false)
			return ``

		return `
			<div id="token_${_color}" class="token_instance" style="background-color: #${_color};">
				<b>#${_color}</b>
				${_owner ? `<i>✔</i>` : ``}
			</div>
		`
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
			el.append = (h) => { el.innerHTML += h }
			el.hide   = ()  => { el.style.display = 'none' }
			el.show   = ()  => { el.style.display = '' }
			el.val 	  = ()  => { return el.value.toUpperCase() }
			el.empty  = ()  => { while (el.firstChild) el.removeChild(el.firstChild) }
			el.append = (h) => { el.insertAdjacentHTML('beforeend', h); }
		}

		return (
			elem.length === 1
			? elem[0]
			: elem.length === 0
				? false
				: elem
		)
	}
}

// initialize page
document.addEventListener('DOMContentLoaded', () => { App.init() })