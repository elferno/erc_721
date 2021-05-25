// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ColorBubble is ERC721Enumerable
{
	// var
	address	public creator;
	string [] public colors;
	struct Await {
		string color;
		bool exists;
	}
	mapping (address => Await) private _awaits;
	mapping (string => bool) private _colorExists;
	uint constant public tokenPrice = 1000000000000000000;


	// modifiers
	modifier OnlyCreator
	{
		require (msg.sender == creator, "CREATOR rights required");
		_;
	}

	modifier PriceFit
	{
		require (msg.value >= tokenPrice, "not enought FUNDS has been sent");
		_;
	}


	// construct
	constructor ()
	ERC721 ('ColorBubble', 'CBBB')
	{
		creator = msg.sender;
	}


	// create token
	function mint
	(
		string memory _color
	)
		public
		payable
		PriceFit
	{
		// check if this color is not existed yet
		require(_colorExists[_color] == false, "color already exists");

		// save color
		colors.push(_color);
		_colorExists[_color] = true;

		// create token ID
		uint _id = colors.length;

		// mint token
		_mint(msg.sender, _id);
	}


	// tell contract to await for pay from other source
	function await
	(
		string memory _color
	)
		public
	{
		_awaits[msg.sender] = Await(_color, true);
	}

	function checkAwait
	(

	)
		view
		public
		returns (string memory)
	{
		return _awaits[msg.sender].color;
	}


	// on receive etiher
	receive ()
		external
		payable
	{
		require (msg.sender != address(0), "no address found");
		require (msg.value >= tokenPrice, "not enought funds");
		require (_awaits[msg.sender].exists == true, "contract doesn't await for this addres to pay");

		mint(_awaits[msg.sender].color);
	}
	
	function emulateReceive
	()
		public
	{
		// check if we were awaiting for this trfansfer
		require (msg.sender != address(0), "no address found");
		//require (msg.value >= tokenPrice, "not enought funds");
		require (_awaits[msg.sender].exists == true, "contract doesn't await for this addres to pay");

		mint(_awaits[msg.sender].color);
	}

}