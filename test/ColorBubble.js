const ColorBubble = artifacts.require('ColorBubble')

contract('ColorBubble', accounts =>
{
	// var
	let contract
	const Test = {
		// variables for tet
		Name     : 'ColorBubble',
		Symbol   : 'CBBB',
		Creator	 : accounts[0]
	}
	const handle = promise => {
		return promise
			.then(data => [data, null])
			.catch(err => [null,  err])
	}

	// create contract instance as the test starts
	before(async() => {
		contract = await ColorBubble.deployed()
	})

	// tests
	it ('description', async () =>
	{
		const name = await contract.name()
		const symbol = await contract.symbol()

		const payData = {from: Test.Creator, value: '1000000000000000000'}
		const mintData = ['FFF', payData]
		await contract.mint(...mintData)

		const _token_FFF = await contract.colors(0)
		console.log(_token_FFF)

		assert.equal(name	 , Test.Name	 , 'sets the correct NAME')
		assert.equal(symbol	 , Test.Symbol	 , 'sets the correct SYMBOL')
	})
})
