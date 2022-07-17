import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { HexToDec } from "../../helpers/formatters";
import useRequest from "../../hooks/useRequest";
import ShowRequests from "../ShowRequests";
import Loader from "../UI/Loader";

const SendedRequest = () => {
    const { FetchCounterRequestCompany, ShowIDRequestCompany, FetchRequest, ShowMessages } = useRequest();
    const [ requests, setRequests] = useState([]);
    const [counterRequest, setCounterRequest] = useState(null);
    const [show, setShow] = useState(false);

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
            let counter = (await FetchCounterRequestCompany());
            setCounterRequest(HexToDec(counter));
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

    useEffect(() => {
        if(requests.length == counterRequest){ 
            setShow(true);
         }

    },[requests])

    return(
        <>
        {
            show ? <ShowRequests requests={requests} ></ShowRequests>
            : <div className="flex w-screen h-screen justify-center items-center">
            <Loader></Loader>
        </div>
        }
        </>
    )
}

export default SendedRequest;