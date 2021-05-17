var keythereum = require("keythereum");
var datadir = "C:/Users/djava/AppData/Local/Ethereum/ropsten/";
var address= "0x34E492Ac038B3FCC731473d14542EC910192c2D5";
const password = "iddqdiddqd";

var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);
console.log(privateKey.toString('hex'));