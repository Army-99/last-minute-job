import { contractABI, ContractAddress } from "../Contract/datas";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

const useCompany = () => {
  const  { Moralis, isAuthenticated, isWeb3Enabled, isWeb3EnableLoading, enableWeb3, web3 } = useMoralis();
  const [isCompany, setIsCompany] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingCompany, setisLoadingCompany] = useState(false);

  useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading){
      enableWeb3();
    }
    if(isWeb3Enabled)
    {
      CheckIsCompany();
    }
	}, [isAuthenticated, web3]);

   const CheckIsCompany = async() => {
    setisLoadingCompany(true);
    if(isAuthenticated)
      {
      let options = {
        contractAddress: ContractAddress,
        functionName: "CheckIsCompany",
        abi: contractABI,
      };
      try{
        setIsCompany(await Moralis.executeFunction(options));
      }catch(err){
        setError(err);
      }
    }
    setisLoadingCompany(false);
  }

  const FetchCompanyPublicJob = async(num) => {
          let options = {
            contractAddress: ContractAddress,
            functionName: "ShowCompanyJobID",
            abi: contractABI,
            params: {
                _nrJob: num
            }
          };
          try{
            const transaction = await Moralis.executeFunction(options);
            return(parseInt(transaction._hex, 16))
          }catch(err){
            console.error(err)
          }
        return null;
  }

  const HireQuestion = async(nrCompanyJob, nrCandidate) => {
    setisLoadingCompany(true);
    let options = {
      contractAddress: ContractAddress,
      functionName: "RequestHire",
      abi: contractABI,
      params: {
          _nrCompanyJob: nrCompanyJob,
          _nrCandidate: nrCandidate 
      }
    };
    try{
      const transaction = await Moralis.executeFunction(options);
      await transaction.wait()
      setisLoadingCompany(false);
      return(parseInt(transaction._hex, 16))
    }catch(err){
      console.error(err)
    }
  setisLoadingCompany(false);
  return null;
  }

  

  return {isCompany,error,isLoadingCompany, FetchCompanyPublicJob, HireQuestion};

}
export default useCompany;