import { useEffect, useState } from "react";
import useCounters from "../../hooks/useCounters";
import { ContractAddress, contractABI } from "../../Contract/datas";
import { useMoralis, useRaribleLazyMint } from "react-moralis";
import ShowJobs from "../ShowJobs";
import Loader from "../UI/Loader"
import useJob from "../../hooks/useJob";

const ShowAllJobs = () => {
    const { counterJobs } = useCounters();
    const { CheckPersonHired, CheckPersonApplied, CheckJobClose  } = useJob();
    const { FetchJob } = useJob();
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const [jobs, setJobs] = useState( [] );

    const addJob = (data, applied, hired, close) => {
        setJobs(prevItems => [...prevItems, {
          id: prevItems.length,
          value: data,
          applied: applied,
          hired: hired,
          close: close
        }]);
      }

    useEffect(() => {
        const Fetch = async() => {
            if(counterJobs>0)
            {
                setJobs([]);
                for (let i=0; i < counterJobs; i++){
                    addJob(await FetchJob(i),await CheckPersonApplied(i),await CheckPersonHired(i), await CheckJobClose(i)) 
                }
            }
        }
        Fetch();
    },[counterJobs]);

    useEffect(() => {
        if(jobs.length==counterJobs){
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

export default ShowAllJobs;