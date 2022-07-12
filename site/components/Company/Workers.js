import { useEffect, useState } from "react";
import { ContractAddress, contractABI} from '../../Contract/datas';
import { useMoralis } from "react-moralis";

const Workers = () => {
    const [counterWorkers, setCounterWorkers] = useState();
    const [workers, setWorkers] = useState([]);
    const [error, setError] = useState();
    const { Moralis } = useMoralis();

    const FetchAllWorkers = async() => {

    }

    const FetchCounterWorkers = async() => {
        console.log("BOH")
        let options = {
            contractAddress: ContractAddress,
            functionName: "GetPersonsCounter",
            abi: contractABI,
          };
          try{
            setCounterWorkers(await Moralis.executeFunction(options));
          }catch(err){
            setError(err);
          }
    }

    useEffect(() => {
        FetchCounterWorkers();
        
    },[])
    console.log(counterWorkers)



    return (
        <div className="flex text-white items-center w-screen h-screen justify-center">
            <p>ALL WORKERS {}</p>
            {error && <p>{error.message}</p>}
        </div>
    )
}

export default Workers;