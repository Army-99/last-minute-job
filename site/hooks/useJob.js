import { useState } from "react";
import { useMoralis } from "react-moralis";
import { ContractAddress, contractABI } from "../Contract/datas";
import HexToDec from "../helpers/formatters";

const useJob = () => {
    const  { Moralis} = useMoralis();
    const [isLoading ,setIsLoading] = useState(false);

    const FetchJob = async(nrJob) => {
            let options = {
            contractAddress: ContractAddress,
            functionName: "ShowJobSummary",
            abi: contractABI,
            params: {
                _nrJob: nrJob 
            }
            };
            try{
                const transaction = await Moralis.executeFunction(options);
                return(transaction)
            }catch(err){
                console.error(err)
            }
        return null;
    }

    const ShowJobCandidatesCounter = async(nrJob) => {
        let options = {
        contractAddress: ContractAddress,
        functionName: "ShowJobCandidatesCounter",
        abi: contractABI,
        params: {
            _nrJob: nrJob 
        }
        };
        try{
            const transaction = await Moralis.executeFunction(options);
            return(HexToDec(transaction))
        }catch(err){
            console.error(err)
        }
    return null;
    }

    const ShowJobCandidate = async(nrJob, nrCandidate) => {
        let options = {
        contractAddress: ContractAddress,
        functionName: "ShowJobCandidate",
        abi: contractABI,
        params: {
            _nrJob: nrJob,
            _nrCandidate: nrCandidate
        }
        };
        try{
            const transaction = await Moralis.executeFunction(options);
            return(transaction)
        }catch(err){
            console.error(err)
        }
    return null;
    }

    const AcceptJob = async(nrJob) => {
        setIsLoading(true);
        let options = {
            contractAddress: ContractAddress,
            functionName: "AcceptJob",
            abi: contractABI,
            params: {
                _nrJob: nrJob,
            }
            };
            try{
                const transaction = await Moralis.executeFunction(options);
                await transaction.wait()
            }catch(err){
                console.error(err)
            }
        setIsLoading(false);
    }

    const CheckPersonHired = async(nrJob) => {
        let options = {
            contractAddress: ContractAddress,
            functionName: "CheckPersonHired",
            abi: contractABI,
            params: {
                _nrJob: nrJob,
            }
            };
            try{
                return await Moralis.executeFunction(options);
            }catch(err){
                console.error(err)
            }
        return null;
    }

    const CheckPersonApplied = async(nrJob) => {
        let options = {
            contractAddress: ContractAddress,
            functionName: "CheckPersonApplied",
            abi: contractABI,
            params: {
                _nrJob: nrJob,
            }
            };
            try{
                return await Moralis.executeFunction(options);
            }catch(err){
                console.error(err)
            }
        return null;
    }

    const CheckJobClose = async(nrJob) => {
        let options = {
            contractAddress: ContractAddress,
            functionName: "ShowCloseJob",
            abi: contractABI,
            params: {
                _nrJob: nrJob,
            }
            };
            try{
                return await Moralis.executeFunction(options);
            }catch(err){
                console.error(err)
            }
    }

    return {FetchJob, ShowJobCandidatesCounter, ShowJobCandidate, AcceptJob, isLoading, CheckPersonHired, CheckPersonApplied, CheckJobClose};
}

export default useJob;