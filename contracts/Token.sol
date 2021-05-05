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
	mapping (address => mapping (address => uint256)) public allowance;

	// events
	event Transfer
	(
		address indexed _from,
		address indexed _to	 ,
		uint256 		_value
	);

	event Approval
	(
		address indexed _owner  ,
		address indexed _spender,
		uint256 		_value
	);

	// modifiers
	modifier enoughtTokens (
		uint256 _value
	) {
		require (
			balanceOf[msg.sender] >= _value,
			"you haven't enought tokens to commit this operation"
		);
		_;
	}

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
		enoughtTokens(_value)
		returns (bool success)
	{
		_transfer (msg.sender, _to, _value);
		return true;
	}

	// approve ability for _spender to transfer _value tokens from my balance
	function approve
	(
		address _spender,
		uint256 _value
	)
		public
		enoughtTokens(_value)
		returns (bool success)
	{
		allowance [msg.sender] [_spender] = _value;
		emit Approval (msg.sender, _spender, _value);
		return true;
	}

	// transfer the approved amout of tokens
	function transferFrom
	(
		address _from,
		address _to,
		uint256 _value
	)
		public
		returns (bool success)
	{
		require (
			allowance [_from] [msg.sender] >= _value,
			"you are not allowed to transfer that amount of tokens from this account"
		);
		require (
			balanceOf [_from] >= _value,
			"requested account has not enough tokens to commit this transfer"
		);

		allowance [_from] [msg.sender] -= _value;
		_transfer (_from, _to, _value);

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