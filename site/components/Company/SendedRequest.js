import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { HexToDec } from "../../helpers/formatters";
import useHub from "../../hooks/useHub";
import useRequest from "../../hooks/useRequest";
import ShowRequests from "../ShowRequests";
import Loader from "../UI/Loader";

const SendedRequest = () => {
    const { isLoadingRequest, FetchCounterRequestCompany, ShowIDRequestCompany, ShowRequest, ShowMessages } = useRequest();
    const { isLoadingHub, ShowCompanyCounterRequests, ShowRequestIDCompany }  = useHub();
    const { account } = useMoralis();
    const [ requests, setRequests] = useState([]);
    const [counterRequest, setCounterRequest] = useState(null);

    const addRequest = (data, nrRequest) => {
        setRequests(prevItems => [...prevItems, {
            id: prevItems.length,
            value: data,
            nr: nrRequest
        }]);
    }

    //Fetch the Request counter of company
    useEffect(() => {
        FetchCounterRequests();
    },[])

    //Fetch the requests when the counter is valorize
    useEffect(() => {
        FetchRequests();
    },[counterRequest])

    const FetchCounterRequests = async() => {
        setCounterRequest(await ShowCompanyCounterRequests());
    }

    const FetchRequests = async() => {
        for(let k=0; k< counterRequest; k++){
            let nrRequestPublic = await ShowRequestIDCompany(account, k);
            //console.log(await ShowRequest(nrRequestPublic))
            
            //addRequest(await ShowRequest(nrRequestPublic),nrRequestPublic);
        }
    }

    return(
        <>
        {
            isLoadingRequest || isLoadingHub ?
            <div className="flex w-screen h-screen justify-center items-center">
                <Loader></Loader>
            </div>
            : 
            <>
                    { counterRequest!=0 ?
                        <ShowRequests requests={requests} />
                        :
                        <div className="flex w-screen h-screen justify-center items-center">
                            <p className="text-white">There are no requests</p>
                        </div>
                    }
            </> 
            
        }
        </>
    )
}

export default SendedRequest;