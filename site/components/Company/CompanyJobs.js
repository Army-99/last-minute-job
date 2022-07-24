import { useEffect, useState } from "react";
import ShowJobs from "../ShowJobs";
import Loader from "../UI/Loader"
import useJob from "../../hooks/useJob";
import useHub from "../../hooks/useHub";
import { useMoralis } from "react-moralis";

const CompanyJobs = () => {
    //const {counterCompanyJobs} = useCounters();
    //const {FetchCompanyPublicJob} = useCompany();
    //const { FetchJob, CheckJobClose } = useJob();
    const { ShowCompanyJobsCounter, isLoadingHub, ShowJobIDCompany } = useHub();
    const { ShowJobSummary , ShowCloseJob, isLoadingJob} = useJob();
    const [ jobs, setJobs] = useState( [] );
    const [ show0, setShow0] = useState(true);
    const [ jobCounter, setJobCounter] = useState(false);
    const [ show, setShow] = useState(false);
    const { account } = useMoralis();

    const addJob = (data, close) => {
        setJobs(prevItems => [...prevItems, {
          id: prevItems.length,
          value: data,
          close: close
        }]);
      }

    useEffect(() => {
        FetchJobCounter();
    },[]);

    useEffect(() => {
        FetchJobs();
    },[jobCounter]);

    const FetchJobCounter = async() => {
        setJobCounter(await ShowCompanyJobsCounter(account));
    };

    const FetchJobs = async() => {
        if(jobCounter>0)
        {
            setJobs([]);
            for (let i=0; i < jobCounter; i++){
                const companyJob = await ShowJobIDCompany(account, i);
                addJob(await ShowJobSummary(companyJob), await ShowCloseJob(companyJob)) 
            }
        }
    };


    //TODO: Check here if jobs counter is 0, add show0
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

export default CompanyJobs;