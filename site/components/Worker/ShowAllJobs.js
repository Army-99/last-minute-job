import { useEffect, useState } from "react";
import ShowJobs from "../ShowJobs";
import Loader from "../UI/Loader"
import useJob from "../../hooks/useJob";
import useHub from "../../hooks/useHub";

const ShowAllJobs = () => {
    const { CheckWorkerHired, CheckWorkerApplied, ShowCloseJob, ShowJobsCounter, isLoadingJob, ShowJobSummary} = useJob();
    const {isLoadingHub } = useHub();
    const [jobs, setJobs] = useState( [] );
    const [jobCounter, setJobCounter] = useState();

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
        //console.log(jobCounter)
    },[jobCounter]);

    const FetchJobCounter = async() => {

        //console.log("SC: "+ await ShowJobsCounter());
        setJobCounter(await ShowJobsCounter());
    }

    const FetchJobs = async() => {
        if(jobCounter){
            setJobs([]);
            for (let i=0; i < jobCounter; i++){
                addJob(await ShowJobSummary(i),await CheckWorkerApplied(i),await CheckWorkerHired(i), await ShowCloseJob(i)) 
            }
        } 
    }

    return(
        <div className="text-white w-screen ml-2 mr-2">
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
        </div>
    );
}

export default ShowAllJobs;