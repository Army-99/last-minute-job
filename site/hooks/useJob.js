import { useState } from "react";
import { useMoralis } from "react-moralis";
import { jobAddress, jobAbi } from "../Contract/datas";
import { HexToDec } from "../helpers/formatters";

const useJob = () => {
    const  { Moralis } = useMoralis();
    const [ isLoadingJob, setIsLoadingJob ] = useState(false);
    const [ errorJob, setErrorJob ] = useState(false);

    const CreateJob = async(owner, title, description, workingAddress, searchingPosition, hourInit, hourFinish, peopleToHire, dateFrom, dateTo) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "CreateJob",
        abi: jobAbi,
        params: {
            _owner: owner,
            _title: title,
            _description: description,
            _workingAddress: workingAddress,
            _searchingPosition: searchingPosition,
            _hourInit: hourInit,
            _hourFinish: hourFinish,
            _peopleToHire: peopleToHire,
            _dateFrom: dateFrom,
            _dateTo: dateTo
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const CheckWorkerApplied = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "CheckWorkerApplied",
        abi: jobAbi,
        params: {
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const CheckWorkerHired = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "CheckWorkerHired",
        abi: jobAbi,
        params: {
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ApplyToJob = async(workerAddress, nrJob, name, surname, mobilePhone, CV, coverLetter) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "CreateJob",
        abi: jobAbi,
        params: {
            worker: workerAddress,
            _nrJob: nrJob,
            _name: name,
            _surname: surname,
            _mobilePhone: mobilePhone,
            _CV: CV,
            _coverLetter: coverLetter,
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const RequestHire = async(nrJob, nrCandidate) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "RequestHire",
        abi: jobAbi,
        params: {
            _nrJob: nrJob,
            _nrCandidate: nrCandidate
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ShowIfHireQuestion = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "ShowIfHireQuestion",
        abi: jobAbi,
        params: {
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const AcceptJob = async(addressWorker, nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "AcceptJob",
        abi: jobAbi,
        params: {
            worker: addressWorker,
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ShowJobsCounter = async() => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "ShowJobsCounter",
        abi: jobAbi,
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ShowJobSummary = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "ShowJobSummary",
        abi: jobAbi,
        params: {
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ShowHiredCounter = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "ShowHiredCounter",
        abi: jobAbi,
        params: {
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ShowJobCandidatesCounter = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "ShowJobCandidatesCounter",
        abi: jobAbi,
        params: {
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ShowJobCandidate = async(nrJob, nrCandidate) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "ShowJobCandidate",
        abi: jobAbi,
        params: {
            _nrJob: nrJob,
            _nrCandidate: nrCandidate
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ShowAbsentHoursCandidate = async(nrJob, nrCandidate) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "ShowAbsentHoursCandidate",
        abi: jobAbi,
        params: {
            _nrJob: nrJob,
            _nrCandidate: nrCandidate
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const CloseSearching = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "CloseSearching",
        abi: jobAbi,
        params: {
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const SetAbsentHours = async(nrJob, nrCandidate, absentHours) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "SetAbsentHours",
        abi: jobAbi,
        params: {
            _nrJob, nrJob,
            _nrCandidate: nrCandidate,
            _absentHours: absentHours
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const CloseAndPay = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "CloseAndPay",
        abi: jobAbi,
        params: {
            _nrJob: nrJob,
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
            await tx.wait();
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };

    const ShowCloseJob = async(nrJob) => {
        setIsLoadingJob(true);
        let tx;
        let options = {
        contractAddress: jobAddress,
        functionName: "ShowCloseJob",
        abi: jobAbi,
        params: {
            _nrJob: nrJob
        }
        };
        try{
            tx = await Moralis.executeFunction(options);
        }catch(err){
            console.error(err)
            setErrorJob(err);
        }
        setIsLoadingJob(false);
        return tx;
    };
    

    return {isLoadingJob, errorJob, CreateJob, CheckWorkerApplied, CheckWorkerHired, ApplyToJob, RequestHire, ShowIfHireQuestion,
            AcceptJob, ShowJobsCounter, ShowJobSummary, ShowHiredCounter, ShowJobCandidatesCounter, ShowJobCandidate, ShowAbsentHoursCandidate,
            CloseSearching,  SetAbsentHours, CloseAndPay, ShowCloseJob};
}

export default useJob;