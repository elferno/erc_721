// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ColorBubble is ERC721Enumerable
{
	// var
	string [] public colors;
	mapping (string => bool) private _colorExists;
	uint constant public tokenPrice = 1000000000000000000;


	// modifiers
	modifier PriceFit
	{
		require (msg.value >= tokenPrice, "not enought FUNDS has been sent");
		_;
	}


	// construct
	constructor ()
	ERC721 ('ColorBubble', 'CBBB')
	{
		
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
}