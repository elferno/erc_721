const Token = artifacts.require('Token')
const TokenSale = artifacts.require('TokenSale')

contract('TokenSale', accounts =>
{
	// var
	let contract, token
	const Test =
	{
		Admin		: accounts[0],
		Buyer		: accounts[1],
		TokensToBuy	: 10,
		TokensToSell: 750000,
		TokenPrice	: 1000000000000000	// wei
	}
	const handle = promise =>
	{
		return promise
			.then(data => [data, null])
			.catch(err => [null,  err])
	}

	// at test start
	before(async() => {
		token = await Token.deployed()
		contract = await TokenSale.deployed()
	})

	// test creation
	it ('initialize contract with correct values', async () =>
	{
		// send tokens to sale contract
		token.transfer(contract.address, Test.TokensToSell, {from: Test.Admin})

		// contract received tokens
		const Contract_Tokens = await token.balanceOf(contract.address)
		assert.equal(Contract_Tokens, Test.TokensToSell, 'contract received sended tokens')

		// sell contract exists
		const C_address = contract.address
		assert.notEqual(C_address, 0x0, 'contract has address')

		// token contract exists
		const T_address = await contract.token_Contract()
		assert.notEqual(T_address, 0x0, 'contract has token address')

		// we have expected admin of sales
		const admin = await contract.admin()
		assert.equal(admin, Test.Admin, 'sets the correct admin')

		// tokens have expected price
		const price = await contract.token_Price()
		assert.equal(price, Test.TokenPrice, 'contract has token address')
	})

	// test buy token
	it ('facilates tokens purchase', async () =>
	{
		// var
		const value = Test.TokensToBuy * Test.TokenPrice
		const buyData = [Test.TokensToBuy, {from: Test.Buyer, value: value}]

		// real purchase -> check event emmited
		const receipt = await contract.buyTokens(...buyData)
		assert.equal(receipt.logs.length		 , 1			   , `triggers one event`)
		assert.equal(receipt.logs[0].event		 , 'Sell'	   	   , `should be the "Sell" event`)
		assert.equal(receipt.logs[0].args._buyer , Test.Buyer	   , `account Buyer`)
		assert.equal(receipt.logs[0].args._amount, Test.TokensToBuy, `tokens purchased`)

		// sold tokens = purchased tokens
		const sold = await contract.token_Sold()
		assert.equal(sold, Test.TokensToBuy, 'sold tokens = purchased tokens')

		// received tokens = purchased tokens
		const receivedTokens = await token.balanceOf(Test.Buyer)
		assert.equal(receivedTokens, Test.TokensToBuy, 'received tokens = purchased tokens')

		// test reqires : low price
		const priceData = [Test.TokensToBuy, {from: Test.Buyer, value: 1}]
		const [, errorPrice] = await handle(contract.buyTokens(...priceData))
		assert.notEqual(errorPrice, null, "transaction revert since not enought funds sent")

		// test reqires : too many tokens
		const overBuy = Test.TokensToSell + 1
		const tokensData = [overBuy, {from: Test.Buyer, value: overBuy * Test.TokenPrice}]
		const [, errorTokens] = await handle(contract.buyTokens(...tokensData))
		assert.notEqual(errorTokens, null, "transaction revert since can't purchase more tokens than available")
	})

	it ('successfuly finished sales', async () =>
	{
		// test reqires : only admin can finish it
		const adminData = [{from: Test.Buyer}]
		const [, errorAdmin] = await handle(contract.endSale(...adminData))
		assert.notEqual(errorAdmin, null, "transaction revert since only ADMIN can finish sales")

		// var
		const closeData = [{from: Test.Admin}]
		const remainingTokens = await token.balanceOf(contract.address)
		const wasAdminTokens  = await token.balanceOf(Test.Admin)

		// transfer remaining tokens back to admin
		await contract.endSale(...closeData)
		const nowAdminTokens  = await token.balanceOf(Test.Admin)
		const nowContractTokens  = await token.balanceOf(contract.address)
		const awaitedAdminTokens = remainingTokens.toNumber() + wasAdminTokens.toNumber()
		assert.equal(nowAdminTokens.toNumber(), awaitedAdminTokens, 'tokens are back to admin')
		assert.equal(nowContractTokens.toNumber(), 0, 'no tokens left for contract')

		// test contract destroyed
		const [, priceError] = await handle(contract.token_Price())
		assert.notEqual(priceError, null, 'contract destroyed')
	})
})