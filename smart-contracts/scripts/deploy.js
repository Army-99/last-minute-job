const hre = require("hardhat");

async function main() {
  /* OLD CONTRACT */
  /*
    const LastMinuteJob = await hre.ethers.getContractFactory("LastMinuteJob");
    const lastiminutejob = await LastMinuteJob.deploy();

    await lastiminutejob.deployed();

    console.log("LastMinuteJob deployed to:", lastiminutejob.address);
  */

  /* NEW */ 
  
  const Hub = await hre.ethers.getContractFactory("HUB");
  const hub = await Hub.deploy();
  await hub.deployed();
  console.log("HUB deployed to:", hub.address);
  //HUB deployed to: 0xe977858B1ABC8ce18E0B4Ad218e8afdB5f3427B4

  const Job = await hre.ethers.getContractFactory("JobContract");
  const job = await Job.deploy(hub.address);
  await job.deployed();
  console.log("JobContract deployed to:", job.address);
  //JobContract deployed to: 0x5388C0DCbBA944024C321A110c2DE29084583b10

  const Request = await hre.ethers.getContractFactory("RequestContract");
  const request = await Request.deploy(hub.address,job.address);
  await request.deployed();
  console.log("RequestContract deployed to:", request.address);
  //RequestContract deployed to: 0x351875F56B61A6c2Cf676CC69251b3b3a779A103

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
