import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {HexToDec} from '../../helpers/formatters'
import Button from "../UI/Button";
import ModalCreateRequest from "./ModalCreateRequest";
import Loader from "../UI/Loader";
import useJob from "../../hooks/useJob";
import useHub from "../../hooks/useHub";

const Workers = () => {
  const { isLoadingHub, errorHub, GetWorkersCounter, ShowWorkerID, ShowWorkerHuman } = useHub();

    const [counterWorkers, setCounterWorkers] = useState();
    const [workers, setWorkers] = useState([]);
    const [error, setError] = useState();
    const [ showModal, setShowModal] = useState(false);
    const [ addressWorker, setAddressWorker ] = useState();

    const addWorker = (data, address) => {
      setWorkers(prevItems => [...prevItems, {
        id: prevItems.length,
        value: data,
        address: address
      }]);
    }

    useEffect(() => {
      FetchCounterWorkers();
    },[])

    useEffect(() => {
      FetchWorker();
    },[counterWorkers])

    const OpenModal = (e, k, address) => {
      e.preventDefault();
      console.log(address)
      setAddressWorker(address);
      setShowModal(true);
    }

    const FetchCounterWorkers = async() => {
      setCounterWorkers(await GetWorkersCounter());
    }

    const FetchWorker = async() => {
      if(counterWorkers)
        for(let k=0; k<counterWorkers; k++)
        {
          let addressWorker = await ShowWorkerID(k);
          addWorker(await ShowWorkerHuman(addressWorker), addressWorker);
        }
    }

    return (
        <>
        {isLoadingHub ?
          <div className="flex w-screen h-screen justify-center items-center">
            <Loader></Loader>
          </div>
        : 
        counterWorkers!=0 ? 
          <>
            {showModal && <ModalCreateRequest addressWorker={addressWorker} close={() => setShowModal(false)}></ModalCreateRequest>}
            <div className="sm:grid md:grid-cols-2 lg:grid-cols-3 sm:w-full">
                <div>
                  {workers.map( (item,k) => {
                    const name = item.value[0];
                    const surname = item.value[1];
                    const age = HexToDec(item.value[2]);
                    const mobilePhone = item.value[3];
                    const CV = item.value[4];
                    const coverLetter = item.value[5];
                    const address = item.address;

                    return(
                      <div className="w-full" key={k}>
                        <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden text-black m-5">
                            <div className="bg-gray-200 text-gray-700 text-lg px-6 py-4">
                                <p className="font-bold">{name} {surname}</p>
                                <p>Age: {age}</p>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 text-black">
                                <p>{coverLetter}</p>
                            </div>

                            <div className="bg-gray-200 px-6 py-4">
                                <div className="flex">
                                    <Button>Show CV</Button>
                                    <Button onClick={(e) => OpenModal(e, k, address)}>Send Request</Button>
                                    <p>Phone: {mobilePhone} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                    
                  }

                  )}
                </div>
                {errorHub && <p>{errorHub.message}</p>}
            </div>
          </>
          :
          <div className="flex w-screen h-screen justify-center items-center">
            <p className="text-white">There are no workers</p>
          </div>
        }
      </>
    )
    
}

export default Workers;