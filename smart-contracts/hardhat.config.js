require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
    networks: {
      ropsten: {
        url: 'https://ropsten.infura.io/v3/e6099d0f5484416eabbbcb1b927ba62d',
        accounts: ['a7bed1688b12c65cf31cd11948746c3368863f47ef672a20af564c53d49c48f6'],
      },
    },
};
