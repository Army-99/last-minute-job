const hre = require("hardhat");

async function main() {
  const LastMinuteJob = await hre.ethers.getContractFactory("LastMinuteJob");
  const lastiminutejob = await LastMinuteJob.deploy();

  await lastiminutejob.deployed();

  console.log("LastMinuteJob deployed to:", lastiminutejob.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
