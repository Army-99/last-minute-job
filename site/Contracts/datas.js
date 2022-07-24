import interfaceHUBAbi from "./ABI/InterfaceHUB.json";
import interfaceJobAbi from "./ABI/InterfaceJOB.json";
import interfaceRequestAbi from "./ABI/InterfaceRequest.json";

const hubAddress="0xcaD422fb4323b083Aa52706238379670f01929EE";
const hubAbi=interfaceHUBAbi.abi;

const jobAddress="0x1EC6E4eeD7935bED0DdDdc4296bA61359e71947a";
const jobAbi=interfaceJobAbi.abi;

const requestAddress="0xF8e080aF18853Dcd6e827E393EF429AAacc432ED";
const requestAbi=interfaceRequestAbi.abi;

export { hubAbi, hubAddress, jobAddress, jobAbi, requestAddress, requestAbi};

