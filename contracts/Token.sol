// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

contract Token
{
	// var
	string constant public name = "DAPP Token";
	string constant public symbol = "DAPT";
	string constant public standard = "DAPP token v 1.0.0";
	uint256 public totalSupply;
	mapping (address => uint256) public balanceOf;

	// events
	event Transfer
	(
		address indexed _from,
		address indexed _to	 ,
		uint256 		_value
	);

	// construct
	constructor (uint256 _initialSupply)
	{
		balanceOf [msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}

	// transfer
	function transfer
	(
		address _to,
		uint256 _value
	)
		public
		returns (bool success)
	{
		require (balanceOf[msg.sender] >= _value, "you haven't enought tokens to commit this operation");
		_transfer (msg.sender, _to, _value);
		return true;
	}

	// private functions
	function _transfer
	(
		address _from,
		address _to,
		uint256 _value
	)
		private
	{
		balanceOf [_from] -= _value;
		balanceOf [_to  ] += _value;

		emit Transfer (_from, _to, _value);
	}
}