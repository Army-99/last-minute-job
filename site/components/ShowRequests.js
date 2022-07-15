import { useMoralis } from "react-moralis";
import HexToDec from "../helpers/formatters";
import usePerson from '../hooks/usePerson';
import useCompany from '../hooks/useCompany';
import Button from './UI/Button';
import { useEffect, useState } from "react";
import ModalShowMessages from "./ModalShowMessages";
import useRequest from "../hooks/useRequest";

const ShowRequests = ({requests}) => {
    const { Moralis } = useMoralis();
    const { isPerson } = usePerson();
    const { isCompany } = useCompany();
    const { CloseRequest, isLoadingRequest, ShowMessages } = useRequest();
    const [ showModal, setShowModal] = useState(false);
    const [ messages, setMessages ] = useState([]);

    const HandleShowMessages = async(e, nrRequest) => {
        e.preventDefault();
        setMessages(await ShowMessages(nrRequest));
    }

    useEffect(() => {
        if(messages.length>0)
            setShowModal(true);
    },[messages])

    const HandleCloseRequest = (e, nrRequest) => {
        e.preventDefault();
        CloseRequest(nrRequest);
    }

 
    return(
        <>
            {showModal && <ModalShowMessages messages={messages} close={() => setShowModal(false)}></ModalShowMessages>}
            <div className="sm:grid md:grid-cols-2 lg:grid-cols-3 sm:w-full">
                {requests.map((item,k) => {
                    let nrRequest = item.nr;
                    let owner= item.value[0];
                    let destination=item.value[1];
                    let dateFrom = new Date(HexToDec(item.value[2])*1000);

                    let dateTo = new Date(HexToDec(item.value[3])*1000);
                    let value = Moralis.Units.FromWei(item.value[4]);

                    let hStart = HexToDec(item.value[5]);
                    let hourStart = ("0" + (Number(hStart)/60).toFixed()).slice(-2);
                    let minuteStart = ("0" +  Number(hStart) % 60).slice(-2);
                    let hFinish = HexToDec(item.value[6]);
                    let hourFinish = ("0" + (Number(hFinish)/60).toFixed()).slice(-2);
                    let minuteFinish = ("0" +  Number(hFinish) % 60).slice(-2);

                    let status=item.value[7];
                    let statusString;
                    switch(status) {
                        case 0: {
                            statusString = "Pending";
                        break;
                        }
                        case 1: {
                            statusString = "Accepted";
                            break;
                        }
                        case 2: {
                            statusString = "Rejected";
                            break;
                        }
                    }
                    let isActive = item.value[8];

                    return(
                        <div className="w-full" key={k}>
                        <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden text-black m-5">
                            <div className="bg-gray-200 text-gray-700 text-lg px-6 py-4">
                                {isActive ? <p>Request is Open</p> : <p>Request is Close</p>}
                                <p className="font-bold">Destination {/*destination*/}</p>
                                <div className="flex justify-between">
                                    <p>{dateFrom.getDate() + '/' + dateFrom.getMonth() + '/' +dateFrom.getFullYear()} - {dateTo.getDate() + '/' + dateTo.getMonth() + '/' +dateTo.getFullYear()}</p>
                                </div>
                                
                                <div className="flex justify-between">
                                    <p>{hourStart}:{minuteStart} - {hourFinish}:{minuteFinish}</p>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 text-black flex justify-between">
                                <p>{statusString}</p>
                                {isPerson && status==0 && <><Button>Accept</Button> <Button>Decline</Button></>}
                                {isCompany && isActive && <Button Loading={isLoadingRequest} onClick={(e) => HandleCloseRequest(e, nrRequest)}>Close</Button>}
                            </div>

                            <div className="bg-gray-200 px-6 py-4">
                                <div className="flex justify-between">
                                    <p>{value} ETH</p>
                                    <Button Loading={isLoadingRequest} onClick={ (e) => HandleShowMessages(e, nrRequest) }>Show messages</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </>
    )
}

export default ShowRequests;