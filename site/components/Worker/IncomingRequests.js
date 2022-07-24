import { useEffect, useState } from "react";
import {HexToDec} from "../../helpers/formatters";
import useHub from "../../hooks/useHub";
import useRequest from "../../hooks/useRequest";
import ShowRequests from "../ShowRequests";
import Loader from "../UI/Loader";

const IncomingRequest = () => {
    const { isLoadingRequest, ShowIDRequestPerson, FetchRequest } = useRequest();
    const { isLoadingHub, ShowWorkerCounterRequests } = useHub();
    const [ requests, setRequests] = useState([]);
    const [counterRequest, setCounterRequest] = useState(null);

    const addRequest = (data, nrRequest) => {
        setRequests(prevItems => [...prevItems, {
            id: prevItems.length,
            value: data,
            nr: nrRequest
        }]);
    }

    //Fetch the Request counter of person
    useEffect(() => {
        FetchWorkerCounterRequest();
    },[])

    //Fetch the requests when the counter is valorize
    useEffect(() => {
        
        FetchRequests();
    },[counterRequest])

    useEffect(() => {
        if(requests.length == counterRequest){
            setShow(true);
            //console.log(requests)
        }
    },[requests])

    const FetchWorkerCounterRequest = async() => {
        setCounterRequest(await ShowWorkerCounterRequests());
    }

    const FetchRequests = async() => {
        for(let k=0; k<counterRequest; k++){
            let nrRequest = (await ShowIDRequestPerson(k));
            addRequest(await FetchRequest(nrRequest),HexToDec(nrRequest));
        }
    }

    return(
        <>
            {
                isLoadingRequest || isLoadingHub ?
                <>
                        { counterRequest!=0 ?
                            <ShowRequests requests={requests} />
                            :
                            <div className="flex w-screen h-screen justify-center items-center">
                                <p className="text-white">There are no requests</p>
                            </div>
                        }
                </> 
                : 
                <div className="flex w-screen h-screen justify-center items-center">
                    <Loader></Loader>
                </div>
            }
        </>
    )
}

export default IncomingRequest;