import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import HexToDec from "../../helpers/formatters";
import useRequest from "../../hooks/useRequest";
import ShowRequests from "../ShowRequests";

const IncomingRequest = () => {
    const { ShowCounterRequestsPerson, ShowIDRequestPerson, FetchRequest, isLoadingRequest } = useRequest();
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
        const Fetch = async() => {
            setCounterRequest(HexToDec(await ShowCounterRequestsPerson()));
        }
        if(isLoadingRequest==false)
            Fetch();
    },[isLoadingRequest])

    //Fetch the requests when the counter is valorize
    useEffect(() => {
        const FetchRequests = async() => {
                for(let k=0; k<counterRequest; k++){
                    let nrRequest = (await ShowIDRequestPerson(k));
                    addRequest(await FetchRequest(nrRequest),HexToDec(nrRequest));
                }
        }
        FetchRequests();
    },[counterRequest])

    useEffect(() => {
        if(requests.length == counterRequest){
            setShow(true);
            //console.log(requests)
        }
    },[requests])

    return(
        <>
        {show && <ShowRequests requests={requests}></ShowRequests>}
        </>
    )
}

export default IncomingRequest;