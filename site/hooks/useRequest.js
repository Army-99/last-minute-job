import { contractABI, ContractAddress } from "../Contract/datas";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import HexToDec from "../helpers/formatters";

const useRequest = () => {
  const  { Moralis, isAuthenticated, isWeb3Enabled, isWeb3EnableLoading, enableWeb3, web3 } = useMoralis();
  const [ errorRequest, setErrorRequest ] = useState(null);
  const [ isLoadingRequest, setIsLoadingRequest ] = useState(false);

    const FetchCounterRequestCompany = async() => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "ShowCounterRequestsCompany",
        abi: contractABI,
        };
        try{
        return await Moralis.executeFunction(options);
        }catch(err){
        console.error(err)
        setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return null;
    }

    const ShowIDRequestCompany = async(nrCompanyRequest) => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "ShowIDRequestCompany",
        abi: contractABI,
        params: {
            _nrCompanyRequest:nrCompanyRequest
        }
        };
        try{
        return await Moralis.executeFunction(options);
        }catch(err){
        console.error(err)
        setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return null;
    }

    //ShowCounterRequestsPerson()

    //ShowIDRequestPerson(uint _nrPersonRequest)

    const FetchRequest = async(nrRequest) => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "ShowRequest",
        abi: contractABI,
        params: {
            _nrRequest: nrRequest
        }
        };
        try{
        return await Moralis.executeFunction(options);
        }catch(err){
        console.error(err)
        setError(err);
        }
        setIsLoadingRequest(false);
        return null;
    }


  return { FetchCounterRequestCompany, ShowIDRequestCompany, FetchRequest };

}
export default useRequest;