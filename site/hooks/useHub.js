import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { hubAbi, hubAddress } from "../Contracts/datas";
import { HexToDec } from "../helpers/formatters";

const useHub = () => {
    const { Moralis, isAuthenticated, isWeb3Enabled, isWeb3EnableLoading, enableWeb3 } = useMoralis();
    const [ isLoadingHub, setIsLoadingHub ] = useState(false);
    const [ errorHub, setErrorHub ] = useState(false);
    

    useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
			enableWeb3();
	}, [isAuthenticated, isWeb3Enabled]);

    const SetContractJobAddress = async(contractJOB) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "SetContractJobAddress",
        abi: hubAbi,
        params: {
            _contractJOB: contractJOB
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowContractJobAddress = async() => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowContractJobAddress",
        abi: hubAbi,
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const SetContractRequestAddress = async(contractREQUEST) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "SetContractRequestAddress",
        abi: hubAbi,
        params: {
            _contractREQUEST: contractREQUEST
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowContractRequestAddress = async() => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowContractRequestAddress",
        abi: hubAbi,
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const CreateCompany = async(name, description, address) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "CreateCompany",
        abi: hubAbi,
        params: {
            _name: name,
            _description: description,
            _address: address
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const CreateWorker = async(name, surname, age, mobilePhone, CV, coverLetter) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "CreateWorker",
        abi: hubAbi,
        params: {
            _name: name,
            _surname: surname,
            _age: age,
            _mobilePhone: mobilePhone,
            _CV: CV,
            _coverLetter: coverLetter
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const CheckCompany = async(address) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "CheckCompany",
        abi: hubAbi,
        params: {
            sender: address
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const CheckWorker = async(address) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "CheckWorker",
        abi: hubAbi,
        params: {
            sender: address
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const GetCompaniesCounter = async() => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "GetCompaniesCounter",
        abi: hubAbi,
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const GetWorkersCounter = async() => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "GetWorkersCounter",
        abi: hubAbi,
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowWorkerHuman = async(address) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowWorkerHuman",
        abi: hubAbi,
        params: {
            _address: address
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowWorkerID = async(nrWorker) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowWorkerID",
        abi: hubAbi,
        params: {
            _nrWorker: nrWorker
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowCompany = async(nrCompany) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowCompany",
        abi: hubAbi,
        params: {
            _nrCompany: nrCompany
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowCompanyJobsCounter = async(address) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowCompanyJobsCounter",
        abi: hubAbi,
        params: {
            sender: address
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowWorkerAppliedJobsCounter = async() => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowWorkerAppliedJobsCounter",
        abi: hubAbi,
        };
        try{
            tx = HexToDec(await Moralis.executeFunction(options));
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowCompanyCounterRequests = async(address) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowCompanyCounterRequests",
        abi: hubAbi,
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowWorkerCounterRequests = async(address) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowWorkerCounterRequests",
        abi: hubAbi,
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowJobIDCompany = async(address, nrJobCompany) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowJobIDCompany",
        abi: hubAbi,
        params: {
            sender: address,
            _nrJobCreated: nrJobCompany
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowJobIDWorker = async(nrJobApplied) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowJobIDWorker",
        abi: hubAbi,
        params: {
            _nrJobApplied: nrJobApplied
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowRequestIDCompany = async(address, nrCompanyRequest) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowRequestIDCompany",
        abi: hubAbi,
        params: {
            sender: address,
            _nrCompanyRequest: nrCompanyRequest
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };

    const ShowRequestIDWorker = async(sender, nrPersonRequest) => {
        setIsLoadingHub(true);
        setErrorHub(false);
        let tx;
        let options = {
        contractAddress: hubAddress,
        functionName: "ShowRequestIDWorker",
        abi: hubAbi,
        params: {
            sender: sender,
            _nrPersonRequest: nrPersonRequest
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorHub(err);
        }
        setIsLoadingHub(false);
        return tx;
    };


    return {isLoadingHub, errorHub, SetContractJobAddress, ShowContractJobAddress, SetContractRequestAddress, ShowContractRequestAddress,
            CreateCompany, CreateWorker, CheckCompany, CheckWorker, GetCompaniesCounter, GetWorkersCounter, ShowWorkerHuman, ShowWorkerID,
            ShowCompany, ShowCompanyJobsCounter, ShowWorkerAppliedJobsCounter, ShowCompanyCounterRequests, ShowWorkerCounterRequests,
            ShowJobIDCompany, ShowJobIDWorker, ShowRequestIDCompany, ShowRequestIDWorker}
};

export default useHub;