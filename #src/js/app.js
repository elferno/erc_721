const App = {
	// var
	web3: {
		instance: null,
		provider: null
	},

	// constructor
	init: function ()
	{
		this.init_WEB_3()
	},


	// get web3 provider
	init_WEB_3: function ()
	{
		this.web3.provider = (typeof web3 !== 'undefined')
			? web3.currentProvider
			: new Web3.providers.HttpProvider('http://localhost:8545')

		this.web3.instance = new Web3(this.web3_provider)
	}
}

document.addEventListener('DOMContentLoaded', () => { App.init() })