const Token = artifacts.require('Token')

contract('Token', accounts =>
{
	// var
	let contract
	const Await = {
		TotalSupply	: 1000000,
		Name		: 'DAPP Token',
		Symbol		: 'DAPT',
		Standard	: 'DAPP token v 1.0.0'
	}
	const Test = {
		Transfer	: 100
	}

	// at test start
	before(async() => {
		contract = await Token.deployed()
	})

	// tests
	it ('initialize contract with correct values', async () =>
	{
		const name = await contract.name()
		const symbol = await contract.symbol()
		const standard = await contract.standard()
		
		assert.equal(name	 , Await.Name	 , 'sets the correct NAME')
		assert.equal(symbol	 , Await.Symbol	 , 'sets the correct SYMBOL')
		assert.equal(standard, Await.Standard, 'sets the correct STANDARD')
	})

	it ('allocates initial supply upon deployment', async () =>
	{
		const totalSupply = await contract.totalSupply()
		const balanceOf = await contract.balanceOf(accounts[0])
		
		assert.equal(totalSupply.toNumber(), Await.TotalSupply, `total supply = ${Await.TotalSupply}`)
		assert.equal(balanceOf.toNumber(), Await.TotalSupply,`creator balance = ${Await.TotalSupply}`)
	})

	it ('transfers token ownership', async () =>
	{
		const receipt = await contract.transfer(accounts[1], Test.Transfer, { from: accounts[0] })
		const balanceOf_0 	 = await contract.balanceOf(accounts[0])
		const balanceOf_1 	 = await contract.balanceOf(accounts[1])
		const afterBalance_0 = Await.TotalSupply - Test.Transfer
		const afterBalance_1 = Test.Transfer

		assert.equal(balanceOf_0.toNumber()		 , afterBalance_0, `balance subtracted`)
		assert.equal(balanceOf_1.toNumber()		 , afterBalance_1, `balance added`)

		assert.equal(receipt.logs.length		 , 1			   , `triggers one event`)
		assert.equal(receipt.logs[0].event		 , 'Transfer'	   , `should be the "Transfer" event`)
		assert.equal(receipt.logs[0].args._from  , accounts[0]	   , `account FROM`)
		assert.equal(receipt.logs[0].args._to 	 , accounts[1]	   , `account TO`)
		assert.equal(receipt.logs[0].args._value , Test.Transfer   , `tokens transfered`)
	})
})