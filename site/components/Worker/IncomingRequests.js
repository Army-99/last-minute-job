import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import HexToDec from "../../helpers/formatters";
import useRequest from "../../hooks/useRequest";
import ShowRequests from "../ShowRequests";

const IncomingRequest = () => {
    const { ShowCounterRequestsPerson, ShowIDRequestPerson, FetchRequest } = useRequest();
    const [ requests, setRequests] = useState([]);
    const [counterRequest, setCounterRequest] = useState(null);

    const addRequest = (data) => {
        setRequests(prevItems => [...prevItems, {
            id: prevItems.length,
            value: data,
        }]);
    }

    //Fetch the Request counter of company
    useEffect(() => {
        const Fetch = async() => {
            setCounterRequest(HexToDec(await ShowCounterRequestsPerson()));
        }
        Fetch();
    },[])

    //Fetch the requests when the counter is valorize
    useEffect(() => {
        const FetchRequests = async() => {
                for(let k=0; k<counterRequest; k++){
                    let nrRequest = await ShowIDRequestPerson(k);
                    addRequest(await FetchRequest(nrRequest));
                }
        }
        FetchRequests();
    },[counterRequest])

    return(
        <>
        <ShowRequests requests={requests}></ShowRequests>
        </>
    )
}

export default IncomingRequest;