const Token = artifacts.require('Token')

contract('Token', accounts =>
{
	let contract
	
	before(async() => {
		contract = await Token.deployed()
	})

	it ('sets total supply upon deployment', async () =>
	{
		const totalSupply = await contract.totalSupply()
		
		assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1.000.000')
	})
})