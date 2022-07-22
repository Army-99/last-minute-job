import { requestAddress, requestAbi } from "../Contracts/datas";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import HexToDec from "../helpers/formatters";

const useRequest = () => {
    const { Moralis} = useMoralis();
    const [ errorRequest, setErrorRequest ] = useState(null);
    const [ isLoadingRequest, setIsLoadingRequest ] = useState(false);

    const CreateRequest = async(destination, title, description, workingAddress, hourInit, hourFinish, dateFrom, dateTo, message) => {
        setIsLoadingRequest(true);
        let tx;
        let options = {
        contractAddress: requestAddress,
        functionName: "CreateRequest",
        abi: requestAbi,
        params: {
            _destination: destination,
            _title: title,
            _description: description,
            _workingAddress: workingAddress,
            _hourInit: hourInit,
            _hourFinish: hourFinish,
            _dateFrom: dateFrom,
            _dateTo: dateTo,
            _message: message
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return tx;
    };

    const SendMessage = async(nrRequest) => {
        setIsLoadingRequest(true);
        let tx;
        let options = {
        contractAddress: requestAddress,
        functionName: "SendMessage",
        abi: requestAbi,
        params: {
            _nrRequest: nrRequest,
            _message: message
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return tx;
    };

    const ShowMessages = async(nrRequest) => {
        setIsLoadingRequest(true);
        let tx;
        let options = {
        contractAddress: requestAddress,
        functionName: "ShowMessages",
        abi: requestAbi,
        params: {
            _nrRequest: nrRequest
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return tx;
    };

    const SetAnswer = async(nrRequest, status) => {
        setIsLoadingRequest(true);
        let tx;
        let options = {
        contractAddress: requestAddress,
        functionName: "SetAnswer",
        abi: requestAbi,
        params: {
            _nrRequest: nrRequest,
            _status: status
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return tx;
    };

    const CloseRequest = async(nrRequest) => {
        setIsLoadingRequest(true);
        let tx;
        let options = {
        contractAddress: requestAddress,
        functionName: "CloseRequest",
        abi: requestAbi,
        params: {
            _nrRequest: nrRequest,
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return tx;
    };

    const ShowCounterRequests = async() => {
        setIsLoadingRequest(true);
        let tx;
        let options = {
        contractAddress: requestAddress,
        functionName: "ShowCounterRequests",
        abi: requestAbi,
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return tx;
    };

    const ShowRequest = async(nrRequest) => {
        setIsLoadingRequest(true);
        let tx;
        let options = {
        contractAddress: requestAddress,
        functionName: "ShowRequest",
        abi: requestAbi,
        params: {
            _nrRequest: nrRequest
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return tx;
    };

    const ShowRequestStatus = async(nrRequest) => {
        setIsLoadingRequest(true);
        let tx;
        let options = {
        contractAddress: requestAddress,
        functionName: "ShowRequestStatus",
        abi: requestAbi,
        params: {
            _nrRequest: nrRequest
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorRequest(err);
        }
        setIsLoadingRequest(false);
        return tx;
    };

    return { isLoadingRequest, errorRequest, CreateRequest, SendMessage, ShowMessages,SetAnswer,CloseRequest,ShowCounterRequests,ShowRequest,ShowRequestStatus};

}
export default useRequest;