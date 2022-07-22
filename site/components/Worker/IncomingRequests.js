import { useEffect, useState } from "react";
import {HexToDec} from "../../helpers/formatters";
import useHub from "../../hooks/useHub";
import useRequest from "../../hooks/useRequest";
import ShowRequests from "../ShowRequests";
import Loader from "../UI/Loader";

const IncomingRequest = () => {
    const { ShowCounterRequestsPerson, ShowIDRequestPerson, FetchRequest, isLoadingRequest } = useRequest();
    const { ShowWorkerCounterRequests, isLoadingHub } = useHub();
    const [ requests, setRequests] = useState([]);
    const [counterRequest, setCounterRequest] = useState(null);
    const [nrRequest, setNrRequest] = useState();
    const [show, setShow] = useState(false);

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
        {isLoadingHub ? 
        <div className="flex w-screen h-screen justify-center items-center">
            <Loader></Loader>
        </div> 
        : 
        <ShowRequests requests={requests}></ShowRequests>
        }
        </>
    )
}

export default IncomingRequest;