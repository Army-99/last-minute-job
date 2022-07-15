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

    const ShowCounterRequestsPerson = async() => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "ShowCounterRequestsPerson",
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

    const ShowIDRequestPerson = async(nrPersonRequest) => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "ShowIDRequestPerson",
        abi: contractABI,
        params: {
            _nrPersonRequest: nrPersonRequest
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

    const ShowMessages = async(nrRequest) => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "ShowMessages",
        abi: contractABI,
        params: {
            _nRequest: nrRequest
        }
        };
        try{
            const transaction = await Moralis.executeFunction(options);
            setIsLoadingRequest(false);
            return transaction;
        }catch(err){
        console.error(err)
        setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return null;
    }

    const SendMessage = async(nrRequest, message) => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "SendMessage",
        abi: contractABI,
        params: {
            _nRequest: nrRequest,
            _message: message
        }
        };
        try{
        const tx = await Moralis.executeFunction(options);
        await tx.wait();
        }catch(err){
        console.error(err)
        setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return null;
    }

    const CloseRequest = async(nrRequest, message) => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "CloseRequest",
        abi: contractABI,
        params: {
            _nRequest: nrRequest
        }
        };
        try{
        const tx = await Moralis.executeFunction(options);
        await tx.wait();
        }catch(err){
        console.error(err)
        setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return null;
    }

  return { FetchCounterRequestCompany, ShowIDRequestCompany, FetchRequest, ShowCounterRequestsPerson, ShowIDRequestPerson, ShowMessages, SendMessage, isLoadingRequest, CloseRequest };

}
export default useRequest;