module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*"
    }
  },

  contracts_directory: "./#src/contracts/",
  contracts_build_directory: "./#src/abi/",

  compilers: {
    solc: {
      version: "0.8.4",
      optimizer: {
        enabled: false,
        runs: 200
      }
    }
  },

  db: {
    enabled: false
  }
};
