import interfaceHUBAbi from "./ABI/InterfaceHUB.json";
import interfaceJobAbi from "./ABI/InterfaceJOB.json";
import interfaceRequestAbi from "./ABI/InterfaceRequest.json";

const hubAddress="0xe977858B1ABC8ce18E0B4Ad218e8afdB5f3427B4";
const hubAbi=interfaceHUBAbi.abi;

const jobAddress="0x5388C0DCbBA944024C321A110c2DE29084583b10";
const jobAbi=interfaceJobAbi.abi;

const requestAddress="0x351875F56B61A6c2Cf676CC69251b3b3a779A103";
const requestAbi=interfaceRequestAbi.abi;

export { hubAbi, hubAddress, jobAddress, jobAbi, requestAddress, requestAbi};

