// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import './Token.sol';
import './Math.sol';

contract TokenSale is DSMath
{
	// var
	address public admin;
	Token 	public token_Contract;
	uint256 public token_Price;
	uint256 public token_Sold;

	// events
	event Sell
	(
		address _buyer,
		uint256 _amount
	);

	// system functions
	//receive () {}

	// construct
	constructor
	(
		Token 	_tokenContract,
		uint256 _price
	)
	{
		admin 			= msg.sender;
		token_Price		= _price;
		token_Contract	= _tokenContract;
	}

	// help functions
	function getDeposit ()
		view
		public
		returns (uint256 deposit)
	{
		return token_Contract.balanceOf(address(this));
	}

	// buy tokens
	function buyTokens
	(
		uint256 _amount
	)
		public
		payable
	{
		// require contract have asked tokens
		require ( getDeposit() >= _amount, "you asked more tokens than contract actually has" );
		require ( msg.value == mul(token_Price, _amount), "not enought funds sent to purchase this amount of tokens" );
		require ( token_Contract.transfer(msg.sender, _amount), "transfer failed" );

		token_Sold = add(token_Sold, _amount);

		emit Sell (msg.sender, _amount);
	}

	// finish sales
	function endSale
	(

	)
		public
	{
		require ( msg.sender == admin, "only ADMIN can finish the sales" );
		require ( token_Contract.transfer(token_Contract.admin(), getDeposit()), "transfer failed" );

		selfdestruct(payable(admin));
	}
}