import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ContractAddress, contractABI } from "../../Contract/datas";
import HexToDec from "../../helpers/formatters";
import useRequest from "../../hooks/useRequest";




const Request = () => {
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const { Moralis } = useMoralis();
    const { FetchCounterRequestCompany, ShowIDRequestCompany, FetchRequest } = useRequest();

    const [counterRequest, setCounterRequest] = useState(null);

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
                    console.log(await FetchRequest(nrRequest));
                }
        }
        FetchRequests();
    },[counterRequest])



    return(
        <div className="text-white">
            REQUESTS S
        </div>
    )
}

export default Request;