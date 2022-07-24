import useHub from "../hooks/useHub";
import Input from "../components/UI/Input";
import Loader from "../components/UI/Loader"
import { useEffect, useRef, useState } from "react";

const Owner = () => {
    const [ jobAddress, setJobAddress] = useState();
    const [ requestAddress, setRequestAddress] = useState();
    const { SetContractJobAddress, ShowContractJobAddress, SetContractRequestAddress, ShowContractRequestAddress, isLoadingHub, errorHub } = useHub();

    useEffect( () => {
        FetchJobAddress();
        FetchRequestAddress();
    },[])



    const JobRef = useRef();
    const RequestRef = useRef();

    const FetchJobAddress = async() => {
        setJobAddress(await ShowContractJobAddress());
    }

    const FetchRequestAddress = async() => {
        setRequestAddress(await ShowContractRequestAddress());
    }

    const HandleSetJobAddress = async(e) => {
        e.preventDefault();
        let error = false;
        if(!JobRef.current.input.value){
            error=true;
            JobRef.current.label.className = "text-red-500 text-xs italic";
        }else JobRef.current.label.className = "hidden";

        if(!error){
            await SetContractJobAddress(JobRef.current.input.value);
        }

    }

    const HandleSetRequestAddress = async(e) => {
        e.preventDefault();
        let error = false;
        if(!RequestRef.current.input.value){
            error=true;
            RequestRef.current.label.className = "text-red-500 text-xs italic";
        }else RequestRef.current.label.className = "hidden";
        if(!error){
            await SetContractRequestAddress(RequestRef.current.input.value);
        }
    }


    return(
        <div className="text-white flex h-screen w-screen items-center justify-center overflow-y-auto scrollbar-hide">
            <div className="h-screen w-screen">
                <h1 className="text-white text-center text-2xl mb-5 uppercase mt-2">Set Addresses HUB CONTRACT</h1>
                <form className="w-full max-w-lg bg-opacity-90 " onSubmit={HandleSetJobAddress}>
                    <Input value={"Job Address"} width={"sm:w-2/3"} type={"text"} ref={JobRef}></Input>
                    <p>{jobAddress}</p>
                    {!isLoadingHub ? <button type="submit" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button> : <Loader></Loader>}
                </form>

                <form className="w-full max-w-lg bg-opacity-90 " onSubmit={HandleSetRequestAddress}>
                    <Input value={"Request Address"} width={"sm:w-2/3"} type={"text"} ref={RequestRef}></Input>
                    <p>{requestAddress}</p>
                    {!isLoadingHub ? <button type="submit" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button> : <Loader></Loader>}
                </form>

            </div> 
        </div>
    )
};

export default Owner;