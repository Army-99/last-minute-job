import { requestAddress, requestAbi } from "../Contract/datas";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import HexToDec from "../helpers/formatters";

const useRequest = () => {
  const  { Moralis} = useMoralis();
  const [ errorRequest, setErrorRequest ] = useState(null);
  const [ isLoadingRequest, setIsLoadingRequest ] = useState(false);

    /*
    function CreateRequest(address _destination,string memory _title,string memory _description, string memory _workingAddress,uint _hourInit,uint _hourFinish, uint _dateFrom, uint _dateTo, string memory _message) external payable;
    function SendMessage(uint _nrRequest, string memory _message) external;
    function ShowMessages(uint _nrRequest) external view returns(Message [] memory);
    function SetAnswer(uint _nrRequest, uint8 _status) external;
    function CloseRequest(uint _nrRequest)  external;
    function ShowCounterRequests() external view returns(uint);
    function ShowRequest(uint _nrRequest) external view returns(address, address, uint, uint,uint,uint,uint, uint8, bool);
    function ShowRequestStatus(uint _nrRequest) external view returns(uint8, bool);
    */

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
        setErrorRequest(err);
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

            //SetAnswer(uint _nRequest, uint8 _status)
    const SetAnswer = async(nrRequest, newStatus) => {
        setIsLoadingRequest(true);
        let options = {
        contractAddress: ContractAddress,
        functionName: "SetAnswer",
        abi: contractABI,
        params: {
            _nRequest: nrRequest,
            _status: newStatus
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

  return { FetchCounterRequestCompany, ShowIDRequestCompany, FetchRequest, ShowCounterRequestsPerson, ShowIDRequestPerson, ShowMessages, SendMessage, isLoadingRequest, CloseRequest, SetAnswer };

}
export default useRequest;