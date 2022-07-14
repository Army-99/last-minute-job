import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ContractAddress, contractABI } from "../../Contract/datas";
import HexToDec from "../../helpers/formatters";
import useRequest from "../../hooks/useRequest";




const Request = () => {
    const { FetchCounterRequestCompany, ShowIDRequestCompany, FetchRequest } = useRequest();
    const { Moralis } = useMoralis();
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
            setCounterRequest(HexToDec(await FetchCounterRequestCompany()));
        }
        Fetch();
    },[])

    //Fetch the requests when the counter is valorize
    useEffect(() => {
        const FetchRequests = async() => {
                for(let k=0; k<counterRequest; k++){
                    let nrRequest = await ShowIDRequestCompany(k);
                    addRequest(await FetchRequest(nrRequest));
                }
        }
        FetchRequests();
    },[counterRequest])



    return(
        <div className="sm:grid md:grid-cols-2 lg:grid-cols-3 sm:w-full">
            {requests.map((item,k) => {
                let owner= item.value[0];
                let destination=item.value[1];
                let dateFrom = HexToDec(item.value[2]);
                let dateTo = HexToDec(item.value[3]);
                let value = Moralis.Units.FromWei(item.value[4]);
                let hourStart = HexToDec(item.value[5])/60;
                //let minuteStart = hourStart % 60;
                let hourFinish = HexToDec(item.value[6]);
                let status;
                switch(item.value[7]) {
                    case 0: {
                        status = "Pending";
                    break;
                    }
                    case 1: {
                        status = "Accepted";
                        break;
                    }
                    case 2: {
                        status = "Rejected";
                        break;
                    }
                }
                let isActive = item.value[8];

                return(
                    <div className="w-full" key={k}>
                    <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden text-black m-5">
                        <div className="bg-gray-200 text-gray-700 text-lg px-6 py-4">
                            <p className="font-bold">Destination HASH</p>
                            <div className="flex justify-between">
                                <p>DateFrom: {dateFrom}</p>
                                <p>DateTo: {dateTo}</p>
                            </div>
                            
                            <div className="flex justify-between">
                                <p>Hour Start: {hourStart}:</p>
                                <p>Hour Finish: {hourFinish}</p>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 text-black">
                            <p>{status}</p>
                        </div>

                        <div className="bg-gray-200 px-6 py-4">
                            <div className="flex">
                                <p>Phone: {value} </p>
                            </div>
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
    )
}

export default Request;