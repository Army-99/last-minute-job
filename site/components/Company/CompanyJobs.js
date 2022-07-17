import { useEffect, useState } from "react";
import useCounters from "../../hooks/useCounters";
import { ContractAddress, contractABI } from "../../Contract/datas";
import { useMoralis, useRaribleLazyMint } from "react-moralis";
import ShowJobs from "../ShowJobs";
import Loader from "../UI/Loader"
import useCompany from "../../hooks/useCompany";
import useJob from "../../hooks/useJob";

const CompanyJobs = () => {
    const {counterCompanyJobs} = useCounters();
    const {FetchCompanyPublicJob} = useCompany();
    const { FetchJob, CheckJobClose } = useJob();
    const [show, setShow] = useState(false);
    const [jobs, setJobs] = useState( [] );

    const addJob = (data, close) => {
        setJobs(prevItems => [...prevItems, {
          id: prevItems.length,
          value: data,
          close: close
        }]);
      }

    useEffect(() => {
        const Fetch = async() => {
            console.log(counterCompanyJobs)
            if(counterCompanyJobs>0)
            {
                setJobs([]);
                for (let i=0; i < counterCompanyJobs; i++){
                    const companyJob = await FetchCompanyPublicJob(i);
                    addJob(await FetchJob(companyJob), await CheckJobClose(companyJob)) 
                }
            }
        }
        Fetch();
    },[counterCompanyJobs]);

    useEffect(() => {
        if(jobs.length==counterCompanyJobs){
            setShow(true);
        }  
    },[jobs])


    return(
        <div className="text-white w-screen ml-2 mr-2">
            {
                show ?
                <ShowJobs jobs={jobs}></ShowJobs>
                :
                <div className="flex w-screen h-screen justify-center items-center">
                    <Loader></Loader>
                </div>
            }
        </div>

    );
}

export default CompanyJobs;