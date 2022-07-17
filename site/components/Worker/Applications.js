import { useEffect, useState } from "react";
import useCounters from "../../hooks/useCounters";
import usePerson from "../../hooks/usePerson";
import Loader from "../UI/Loader"
import ShowJobs from "../ShowJobs";
import useJob from "../../hooks/useJob";


const Applications = () => {
    const [jobs, setJobs] = useState([]);
    const [show, setShow] = useState(false);
    const { counterAppliedJobs } = useCounters();
    const { FetchPersonPublicJob, CheckIfHireQuestion, CheckIfHired } = usePerson();
    const { FetchJob, AcceptJob, isLoading, CheckJobClose } = useJob();

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
    const Fetch = async() => {
      setJobs([]);
      if(counterAppliedJobs<=0 || isLoading) return;
      for (let i=0; i < counterAppliedJobs; i++){
        const personAppliedJob = await FetchPersonPublicJob(i);
        addItem(await FetchJob(personAppliedJob), await CheckIfHireQuestion(i), await CheckIfHired(i), await CheckJobClose(i));
      }
    }
    Fetch();
  },[counterAppliedJobs,isLoading]);

  useEffect(() => {
    if(jobs.length==counterAppliedJobs){
      setShow(true);
    }  
  },[jobs])

  const HandleAcceptJob = async(e, nrAppliedJob) => {
    e.preventDefault();
    const jobID = await FetchPersonPublicJob(nrAppliedJob);
    await AcceptJob(jobID);
  }


    return(
      <div className="text-white w-screen ml-2 mr-2">
      {
          show ?
          <ShowJobs jobs={jobs} applied={true} acceptJob={HandleAcceptJob} Loading={isLoading}></ShowJobs>
          :
          <div className="flex w-screen h-screen justify-center items-center">
            <Loader></Loader>
          </div>
      }
  </div>
    );
};

export default Applications;