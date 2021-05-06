const Token = artifacts.require("Token");
const TokenSale = artifacts.require("TokenSale");

module.exports = async function (deployer) {
  await deployer.deploy(Token, 1000000);

  const token = Token.address;
  const price = 1000000000000000;
  await deployer.deploy(TokenSale, token, price);
};
