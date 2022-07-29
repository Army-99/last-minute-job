import { useEffect, useState } from "react";
import Loader from "../UI/Loader"
import ShowJobs from "../ShowJobs";
import useJob from "../../hooks/useJob";
import useHub from "../../hooks/useHub";

const Applications = () => {
    const { FetchPersonPublicJob, } = useJob();
    const { isLoadingJob, ShowJobSummary, AcceptJob, ShowIfHireQuestion, CheckWorkerHired, ShowCloseJob } = useJob();
    const { isLoadingHub, ShowWorkerAppliedJobsCounter, ShowJobIDWorker } = useHub();
    const [jobs, setJobs] = useState([]);
    const [show, setShow] = useState(false);
    const [ counterAppliedJobs, setCounterAppliedJobs ] = useState();

    const addItem = (data, hireQuestion, hired, close) => {
      setJobs(prevItems => [...prevItems, {
        id: prevItems.length,
        value: data,
        propose: hireQuestion,
        hired: hired,
        close: close
      }]);
    }

  useEffect(() => {
    FetchWorkerAppliedJob();
  },[])

  useEffect(() => {
    FetchJobs();
  },[counterAppliedJobs]);

  useEffect(() => {
    if(jobs.length==counterAppliedJobs){
      setShow(true);
    }  
  },[jobs])

  const FetchJobs = async() => {
    setJobs([]);
    if(counterAppliedJobs<=0 || isLoadingJob) return;
    for (let i=0; i < counterAppliedJobs; i++){
      const workerAppliedJob = await ShowJobIDWorker(i);
      addItem(await ShowJobSummary(workerAppliedJob), await ShowIfHireQuestion(i), await CheckWorkerHired(i), await ShowCloseJob(i));
    }
  }

  const HandleAcceptJob = async(e, nrAppliedJob) => {
    e.preventDefault();
    const jobID = await FetchPersonPublicJob(nrAppliedJob);
    await AcceptJob(jobID);
  }

  const FetchWorkerAppliedJob = async() => {
    setCounterAppliedJobs(await ShowWorkerAppliedJobsCounter());
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
                    { counterAppliedJobs!=0 ?
                        <ShowJobs jobs={jobs} applied={true} acceptJob={HandleAcceptJob} Loading={isLoadingJob}></ShowJobs>
                        :
                        <div className="flex w-screen h-screen justify-center items-center">
                            <p className="text-white">There are no jobs</p>
                        </div>
                    }
                </>
            }
        </div>
    );
};

export default Applications;