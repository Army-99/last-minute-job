import { contractABI, ContractAddress } from "../Contract/datas";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import HexToDec from "../helpers/formatters";

const usePerson = () => {
  const  { Moralis, isAuthenticated, isWeb3Enabled, isWeb3EnableLoading, enableWeb3, web3 } = useMoralis();
  const [isPerson, setIsPerson] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading){
      enableWeb3();
    }
    if(isWeb3Enabled)
    {
      CheckIsPerson();
    }
	}, [isAuthenticated, web3]);

   const CheckIsPerson = async() => {
    setIsLoading(true);
    if(isAuthenticated)
      {
      let options = {
        contractAddress: ContractAddress,
        functionName: "CheckIsPerson",
        abi: contractABI,
      };
      try{
        setIsPerson(await Moralis.executeFunction(options));
      }catch(err){
        setError(err);
      }
    }
    setIsLoading(false);
  }

  const FetchPersonPublicJob = async(num) => {
    setIsLoading(true);
      let options = {
        contractAddress: ContractAddress,
        functionName: "showAppliedJob",
        abi: contractABI,
        params: {
          _nrAppliedJob: num
        }
      };
      try{
        const transaction = await Moralis.executeFunction(options);
        return HexToDec(transaction);
      }catch(err){
        console.error(err)
        setError(err);
      }
    setIsLoading(false);
    return null;
}

  const CheckIfHireQuestion = async(nrJobApplied) => {
    setIsLoading(true);
      let options = {
        contractAddress: ContractAddress,
        functionName: "ShowIfHireQuestion",
        abi: contractABI,
        params: {
          _jobApplied: nrJobApplied
        }
      };
      try{
        return await Moralis.executeFunction(options);
      }catch(err){
        console.error(err)
        setError(err);
      }
    setIsLoading(false);
    return null;
  }

  const CheckIfHired = async(nrJobApplied) => {
    setIsLoading(true);
      let options = {
        contractAddress: ContractAddress,
        functionName: "ShowIfHired",
        abi: contractABI,
        params: {
          _jobApplied: nrJobApplied
        }
      };
      try{
        return await Moralis.executeFunction(options);
      }catch(err){
        console.error(err)
        setError(err);
      }
    setIsLoading(false);
    return null;
  }

  const FetchWorker = async(nrWorker) => {
      let options = {
        contractAddress: ContractAddress,
        functionName: "ShowPerson",
        abi: contractABI,
        params: {
          _nrWorker: nrWorker
        }
      };
      try{
        return await Moralis.executeFunction(options);
      }catch(err){
        console.error(err)
        setError(err);
      }
    setIsLoading(false);
    return null;

  }


  return {isPerson,error,isLoading, FetchPersonPublicJob, CheckIfHireQuestion, CheckIfHired, FetchWorker};

}
export default usePerson;