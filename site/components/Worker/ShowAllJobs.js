import { useEffect, useState } from "react";
import ShowJobs from "../ShowJobs";
import Loader from "../UI/Loader"
import useJob from "../../hooks/useJob";
import useHub from "../../hooks/useHub";

const ShowAllJobs = () => {
    const { CheckWorkerHired, CheckWorkerApplied, ShowCloseJob, ShowJobsCounter, isLoadingJob, FetchJob} = useJob();
    const {isLoadingHub } = useHub();
    const [jobs, setJobs] = useState( [] );
    const [jobCounter, setJobCounter=0] = useState(0);

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
        FetchJobCounter();
    },[])

    useEffect(() => {
        FetchJobs();
    },[jobCounter]);

    const FetchJobCounter = async() => {
        setJobCounter(await ShowJobsCounter());
    }

    const FetchJobs = async() => {
        if(jobCounter=0){
            setJobs([]);
            for (let i=0; i < jobCounter; i++){
                addJob(await FetchJob(i),await CheckWorkerApplied(i),await CheckWorkerHired(i), await ShowCloseJob(i)) 
            }
        } 
    }

    return(
        <>
            {
                isLoadingJob || isLoadingHub ?
                <div className="flex w-screen h-screen justify-center items-center">
                    <Loader></Loader>
                </div>
                :
                <>
                    { jobCounter!=0 ?
                        <ShowJobs jobs={jobs}></ShowJobs>
                        :
                        <div className="flex w-screen h-screen justify-center items-center">
                            <p className="text-white">There are no jobs</p>
                        </div>
                    }
                </>
            }
        </>

    );
}

export default ShowAllJobs;