import { useEffect, useState } from "react";
import ShowJobs from "../ShowJobs";
import Loader from "../UI/Loader"
import useJob from "../../hooks/useJob";
import useHub from "../../hooks/useHub";

const ShowAllJobs = () => {
    const { CheckWorkerHired, CheckWorkerApplied, ShowCloseJob, ShowJobsCounter, isLoadingJob} = useJob();
    const { FetchJob } = useJob();
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const [jobs, setJobs] = useState( [] );
    const [counterJobs, setCounterJobs] = useState(0);

    const addJob = (data, applied, hired, close) => {
        setJobs(prevItems => [...prevItems, {
          id: prevItems.length,
          value: data,
          applied: applied,
          hired: hired,
          close: close
        }]);
      }

    useEffect( () => {
        FetchCounterJobs();
    },[])

    useEffect(() => {
        FetchJobs();
    },[counterJobs]);

    const FetchCounterJobs = async() => {
        setCounterJobs(await ShowJobsCounter());
    }

    const FetchJobs = async() => {
        if(counterJobs){
            setJobs([]);
            for (let i=0; i < counterJobs; i++){
                addJob(await FetchJob(i),await CheckWorkerApplied(i),await CheckWorkerHired(i), await ShowCloseJob(i)) 
            }
        } 
    }

    

    

    return(
        <div className="text-white w-screen ml-2 mr-2">
            {
                isLoadingJob ?
                <div className="flex w-screen h-screen justify-center items-center">
                    <Loader></Loader>
                </div>
                :
                <ShowJobs jobs={jobs}></ShowJobs>
            }
        </div>

    );
}

export default ShowAllJobs;