import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import usePerson from "../hooks/usePerson";
import Button from "./UI/Button";
import { ContractAddress, contractABI} from "../Contract/datas";
import useCounter from "../hooks/useCounters"
import Link from 'next/link';
import HexToDec from "../helpers/formatters";
import { useRouter } from "next/router";


const ShowJobs = ({jobs, applied, acceptJob, Loading}) => {

    const { Moralis, isAuthenticated } = useMoralis();
    const { isPerson } = usePerson();
    const [ isLoading, setIsLoading] = useState(false);
    const [ error, setError] = useState(false);
    const router = useRouter();


    const HandleCandidate = (e, nrJob) => {
        e.preventDefault();
        //console.log("PREMUTO " + nrJob)
        Candidate(nrJob);
        router.push("/worker/jobApplications");
    }

    const Candidate = async(nrJob) => {
        setIsLoading(true);
          let options = {
            contractAddress: ContractAddress,
            functionName: "applyToJob",
            abi: contractABI,
            params: {
                _nrJob: nrJob
            },
          };
          try{
            const tx  = await Moralis.executeFunction(options);
            await tx.wait();
            setIsLoading(false);
          }catch(err){
            setError(err);
            setIsLoading(false);
          }
        
    }

    return(
        <>
        {isAuthenticated &&
        <div className="sm:grid md:grid-cols-2 lg:grid-cols-3 sm:w-full">
            {
                jobs.map( (item,k) => {
                    //console.log(item)
                    let title = item.value[2];
                    let owner = item.value[0];
                    let total = Moralis.Units.FromWei(item.value[1]);
                    let description = item.value[3];
                    let workingAddress = item.value[4];
                    let searchingPosition = item.value[5];
                    let peopleToHire = HexToDec(item.value[6]);
                    let dateInit = new Date(HexToDec(item.value[7]) * 1000);
                    let dateFinish = new Date(HexToDec(item.value[8]) * 1000);
                    let searching = item.value[9];
                    let counterCandidates = HexToDec(item.value[10]);

                    return(
                            <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden text-black m-5" key={k}>
                                <div className="bg-gray-200 text-gray-700 text-lg px-6 py-4">
                                    <p className="text-center">{title} - { item.close ? "FINISHED" : total + "ETH"} </p>
                                    {item.propose && <div className="flex"><p className="text-red-400">ATTENTION! You've been selected!</p><Button Loading={Loading} onClick={e => acceptJob(e, k)}>Accept the job</Button></div>}
                                    {item.applied && !item.hired && <div className="flex"><p className="text-blue-400">You're a candidate!</p></div>}
                                    {item.hired && <div className="flex"><p className="text-green-400">You're Hired!</p></div>}
                                    <p>{workingAddress} ({searchingPosition})</p>
                                    <p>Candidates: {counterCandidates}</p>
                                    <p>Searching for {peopleToHire} person</p>
                                    <p>Person hired N</p>
                                </div>

                                <div className="flex justify-between items-center px-6 py-4">
                                {searching ? <div className="bg-green-600 text-xs uppercase px-2 py-1 rounded-full border border-gray-200 text-gray-200 font-bold">Searching</div> 
                                : <div className="bg-red-600 text-xs uppercase px-2 py-1 rounded-full border border-gray-200 text-gray-200 font-bold">Close search</div>}
                                {isPerson && !item.applied && !applied && <Button Loading={isLoading} onClick={e => HandleCandidate(e,k)}>Candidate</Button>}
                                <div className="text-sm">{dateInit.getDate() + '/' + dateInit.getMonth() + '/' +dateInit.getFullYear()} - {dateFinish.getDate() + '/' + dateFinish.getMonth() + '/' +dateFinish.getFullYear()}</div>
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200 text-black">
                                    {description}
                                </div>

                                <div className="bg-gray-200 px-6 py-4">
                                    {owner.toUpperCase() != Moralis.account.toUpperCase() ?
                                    <>
                                        <div className="uppercase text-xs text-gray-600 font-bold">Company</div>
                                        <div className="flex items-center pt-3">
                                            <div className="ml-4">
                                                <p className="font-bold">HASH{/*owner*/}</p>
                                            </div>
                                        </div>
                                    </>
                                    :
                                        <div>
                                            <Link href={`/company/${k}`}><Button>Manage</Button></Link>
                                        </div>
                                    }
                                </div>
                            </div>
                          )
                    }) 
                }
        </div>   
    }
    </>
    );
}

export default ShowJobs;