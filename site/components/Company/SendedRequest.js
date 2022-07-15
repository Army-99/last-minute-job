import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import HexToDec from "../../helpers/formatters";
import useRequest from "../../hooks/useRequest";
import ShowRequests from "../ShowRequests";

const SendedRequest = () => {
    const { FetchCounterRequestCompany, ShowIDRequestCompany, FetchRequest, ShowMessages } = useRequest();
    const { Moralis } = useMoralis();
    const [ requests, setRequests] = useState([]);
    const [ messages, setMessages] = useState([]);
    const [counterRequest, setCounterRequest] = useState(null);
    const [nrRequest, setNrRequest] = useState();

    const addRequest = (data, nrRequest) => {
        setRequests(prevItems => [...prevItems, {
            id: prevItems.length,
            value: data,
            nr: nrRequest
        }]);
    }

    //Fetch the Request counter of company
    useEffect(() => {
        const Fetch = async() => {
            setCounterRequest(HexToDec(await FetchCounterRequestCompany()));
        }
        Fetch();
    },[])

    //Fetch the requests when the counter is valorize
    useEffect(() => {
        const FetchRequests = async() => {
                for(let k=0; k<counterRequest; k++){
                    let nrRequest = await ShowIDRequestCompany(k);
                    addRequest(await FetchRequest(nrRequest),HexToDec(nrRequest));
                }
        }
        FetchRequests();
    },[counterRequest])

    useEffect(()=> {
        const FetchMessage = async() => {
            if(nrRequest)
                setMessages(await ShowMessages(nrRequest));
        }
        FetchMessage();
        
    },[nrRequest])

    return(
        <ShowRequests requests={requests} ></ShowRequests>
    )
}

export default SendedRequest;