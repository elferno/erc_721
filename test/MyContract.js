const MyContract = artifacts.require('MyContract')

contract('MyContract', accounts =>
{
	// var
	let contract
	const Test = {
		// variables for tet
		Name     : 'MyContract',
		Symbol   : 'MTK',
		Standard : 'ERC-721'
	}
	const handle = promise => {
		return promise
			.then(data => [data, null])
			.catch(err => [null,  err])
	}

	// create contract instance as the test starts
	before(async() => {
		contract = await MyContract.deployed()
	})

	// tests
	it ('description', async () =>
	{
		const name = await contract.name()
		const symbol = await contract.symbol()
		const standard = await contract.standard()

		assert.equal(name	 , Test.Name	 , 'sets the correct NAME')
		assert.equal(symbol	 , Test.Symbol	 , 'sets the correct SYMBOL')
		assert.equal(standard, Test.Standard , 'sets the correct STANDARD')
	})
})
