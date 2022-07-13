import { useEffect, useState } from "react";
import { ContractAddress, contractABI} from '../../Contract/datas';
import { useMoralis } from "react-moralis";
import HexToDec from '../../helpers/formatters'
import usePerson from "../../hooks/usePerson";
import Button from "../UI/Button";
import useCompany from "../../hooks/useCompany";
import ModalCreateRequest from "./ModalCreateRequest";

const Workers = () => {
    const [counterWorkers, setCounterWorkers] = useState();
    const [workers, setWorkers] = useState([]);
    const [error, setError] = useState();
    const { Moralis } = useMoralis();
    const { FetchWorker } = usePerson();
    const [ showModal, setShowModal] = useState(false);
    const [ addressWorker, setAddressWorker ] = useState();

    const addWorker = (data,item) => {
      setWorkers(prevItems => [...prevItems, {
        id: prevItems.length,
        value: data,
      }]);
    }

    useEffect(() => {
      const FetchCounterWorkers = async() => {
        let options = {
            contractAddress: ContractAddress,
            functionName: "GetPersonsCounter",
            abi: contractABI,
          };
          try{
            setCounterWorkers(HexToDec(await Moralis.executeFunction(options)));
          }catch(err){
            setError(err);
          }
        }
        FetchCounterWorkers();
    },[])

    useEffect(() => {
      const Fetch = async(nrWorker) => {
        addWorker(await FetchWorker(nrWorker))
      }

      if(counterWorkers)
        for(let k=0; k<counterWorkers; k++)
          Fetch(k);
    },[counterWorkers])

    const OpenModal = (e, k, address) => {
      e.preventDefault();
      setAddressWorker(address);
      setShowModal(true);
    }


    return (
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
                const address = item.value[6];

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
            {error && <p>{error.message}</p>}
        </div>
      </>
    )
}

export default Workers;