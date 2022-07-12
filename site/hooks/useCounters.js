import { useState, useEffect } from "react";
import { contractABI, ContractAddress } from "../Contract/datas";
import { useMoralis } from "react-moralis";
import useCompany from "./useCompany";
import usePerson from "./usePerson";

const useCounters = () => {
    const { Moralis } = useMoralis();
    const { isCompany } = useCompany();
    const { isPerson } = usePerson();

    const [counterAppliedJobs, setCounterAppliedJobs] = useState(null);
    const [counterCompanyJobs, setCounterCompanyJobs] = useState(null);
    const [counterJobs, setCounterJobs] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      FetchCounterJobs();
      if(isPerson)
        FetchCounterAppliedJob();
      if(isCompany)
        FetchCounterCompanyJobs();
      
    },[isPerson,isCompany]);

    const FetchCounterAppliedJob = async() => {
        setIsLoading(true);
          let options = {
            contractAddress: ContractAddress,
            functionName: "appliedJobsCounter",
            abi: contractABI,
          };
          try{
            let counter = await Moralis.executeFunction(options);
            setCounterAppliedJobs(parseInt(counter._hex, 16));
          }catch(err){
            setError(err);
          }
        setIsLoading(true);
    }

    const FetchCounterCompanyJobs = async() => {
      setIsLoading(true);
        let options = {
          contractAddress: ContractAddress,
          functionName: "ShowCompanyJobsCounter",
          abi: contractABI,
        };
        try{
          let counter = await Moralis.executeFunction(options);
          setCounterCompanyJobs(parseInt(counter._hex, 16));
        }catch(err){
          setError(err);
        }
      setIsLoading(true);
  }

    const FetchCounterJobs = async() => {
      setIsLoading(true);
        let options = {
          contractAddress: ContractAddress,
          functionName: "ShowJobsCounter",
          abi: contractABI,
        };
        try{
          let counter = await Moralis.executeFunction(options);
          setCounterJobs(parseInt(counter._hex, 16));
        }catch(err){
          setError(err);
        }
      setIsLoading(true);
  }

    return { counterAppliedJobs,counterCompanyJobs,counterJobs, isLoading, error}

};

export default useCounters;