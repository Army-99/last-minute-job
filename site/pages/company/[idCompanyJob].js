import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react"
import { MoralisProvider, useMoralis } from "react-moralis";
import { ContractAddress, contractABI} from "../../Contract/datas";
import useJob from "../../hooks/useJob";
import Candidate from "../../components/Company/Candidate";
import Button from "../../components/UI/Button";
import useCredentials from "../../hooks/useCredentials";

const ManageJob = () => {
    const { isAuthenticated, Moralis } = useMoralis();
    const { isCompany } = useCredentials();
    const { FetchCompanyPublicJob, HireQuestion, isLoadingJob } = useJob();
    const { FetchJob, ShowJobCandidatesCounter, ShowJobCandidate, CheckJobClose, SetAbsentHours } = useJob();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [job, setJob] = useState(); 
    const router = useRouter()
    const {idCompanyJob} = router.query;

    const [jobID, setJobID] = useState();
    const [owner,setOwner] = useState();
    const [searching,setSearching] = useState();
    const [counterCandidates, setCounterCandidates] = useState();
    const [candidates, setCandidates] = useState([]);
    const [jobClose, setJobClose] = useState(null);
    const refHoursAbsent = useRef();
    

    //Check if is auth, is company and is the owner
    useEffect(() => {
        if(!isAuthenticated){
            router.replace("/");
        }
        else{
            if(isCompany!=null && !isCompany){
                router.replace("/dashboard");
            }
        }
        
        if(owner && isAuthenticated) {
            if(owner.toUpperCase() !== Moralis.account.toUpperCase())
                router.replace("/dashboard");
        }
        
    },[isCompany, isAuthenticated, owner])

    //Fetching the public ID of the job
    useEffect(() => {
        const Fetch = async() => {
            setJobID(await FetchCompanyPublicJob(idCompanyJob));
        }
        Fetch();
    },[idCompanyJob]);

    //Fetch Summary Job and set counter candidates
    useEffect(() => {
        const Fetch = async() => {
            if(jobID>=0 && !isLoading){
                //for take summary of the job
                setJob(await FetchJob(jobID));
                //for take the counter of candidates
                setCounterCandidates(await ShowJobCandidatesCounter(jobID));
            }
        }
        Fetch();  
        //console.log(job)
    },[jobID, isLoading])

    //when job is initialized set owner for the check of the first useeffect
    useEffect(()=> {
        
        const SetStates = async() => {
            setOwner(job[0]);
            setSearching(job[9]);
            setJobClose(await CheckJobClose(jobID));
        }
        if(job)
            SetStates()

    },[job])

    //Fetch the candidates and push into an array
    useEffect(() => {
        const Fetch = async() => {
            setCandidates([]);
            if(counterCandidates>0 && candidates.length<counterCandidates){
                setCandidates([]);
                for(let k=0; k<counterCandidates;k++)
                    addCandidate(await ShowJobCandidate(jobID, k))
            }
        }
        Fetch();
        //console.log(candidates)
    },[counterCandidates,isLoadingJob])

    //For manage the state with array
    const addCandidate = (data) => {
        setCandidates(prevItems => [...prevItems, {
          id: prevItems.length,
          value: data
        }]);
    }

    const HandleHireQuestion = (e, nrCandidate) => {
        e.preventDefault();
        HireQuestion(idCompanyJob,nrCandidate);
    }

    //Call to ClosePay smart contract
    const ClosePay = async(e,nrJob) => {
        e.preventDefault();
        setIsLoading(true);
        let options = {
            contractAddress: ContractAddress,
            functionName: "CloseAndPay",
            abi: contractABI,
            params: {
                _nrJob: nrJob,
            }
            };
            try{
                const tx = await Moralis.executeFunction(options);
                await tx.wait();
            }catch(err){
                console.error(err)
                setError(err);
            }
        setIsLoading(false);
    }

    //Call to CloseSearching smart contract
    const CloseSearch = async(e,nrJob) => {
        e.preventDefault();
        setIsLoading(true);
        let options = {
            contractAddress: ContractAddress,
            functionName: "CloseSearching",
            abi: contractABI,
            params: {
                _nrJob: nrJob,
            }
            };
            try{
                const tx = await Moralis.executeFunction(options);
                await tx.wait();
            }catch(err){
                console.error(err)
                setError(err);
            }
        setIsLoading(false);
    }


    const HandleSetAbsentHour = async(e, nrCandidate) => {
        e.preventDefault();
        /*CHECK IF THE MAX HOURS IS > HOURS TO ADD(ALREADY CHECKED IN SMART CONTRACT)*/

        if(!refHoursAbsent.current.input.value || refHoursAbsent.current.input.value < 1){
            error=true;
            refHoursAbsent.current.label.className = "text-red-500 text-xs italic";
        }else refHoursAbsent.current.label.className = "hidden";

        let options = {
            contractAddress: ContractAddress,
            functionName: "SetAbsentHours",
            abi: contractABI,
            params: {
                _nrJob: jobID,
                _nrCandidate: nrCandidate,
                _absentHours: refHoursAbsent.current.input.value,
            }
            };
            try{
                return await Moralis.executeFunction(options);
            }catch(err){
                console.error(err)
            }
        
    }

    

    return(
        <>
        {isAuthenticated && isCompany && owner &&
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 w-full h-screen overflow-y-auto scrollbar-hide">
            {
                candidates.map((item,i) => { 
                    return(
                       <Candidate item={item} jobClose={jobClose} isLoadingJob={isLoadingJob} proposeHire={e => HandleHireQuestion(e,i)} SetAbsentHours={ e => HandleSetAbsentHour(e,i)} refHoursAbsent={refHoursAbsent}></Candidate>
                    )})
            }
            <div className="flex justify-center h-10">
                {searching && <Button Loading={isLoading} onClick={(e) => CloseSearch(e,jobID)}>Close search</Button>}
                {!searching && !jobClose && jobClose != null && <Button Loading={isLoading} onClick={(e) => ClosePay(e,jobID)}>Close And Pay</Button>}
                {error && <p className="text-red-500">ERROR {error.message}</p>}
            </div>
        </div>
        }
        </>
    );
}

export default ManageJob;