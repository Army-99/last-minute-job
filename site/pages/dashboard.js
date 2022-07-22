import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from 'next/router';
import CreateCompany from "../components/Form/CreateCompany";
import CreateWorker from "../components/Form/CreateWorker";
import useCredentials from "../hooks/useCredentials";

const Dashboard = () => {
    const { isAuthenticated, web3 } = useMoralis();
    const { isCompany, isWorker} = useCredentials();
    const [ registeringPerson, setRegisteringPerson ] = useState(false);
    const [ registeringCompany, setRegisteringCompany ] = useState(false);
    const router = useRouter(); 

    useEffect(() => {
        const Check = async() => {
            if (!isAuthenticated) router.replace("/");
            if(isCompany) router.replace("/company");
            if(isWorker) router.replace("/worker");
        }
        Check();
    },[isAuthenticated, isCompany, isWorker, web3])

    return(
    <div className="text-black flex h-screen w-screen items-center justify-center" >
        {!registeringCompany && !registeringPerson && isCompany!=null && isWorker!=null && !isWorker && !isCompany
        && 
        <div className="space-y-4">
            <button className="w-full px-7 py-4 text-xl rounded-xl bg-yellow-300 cursor-pointer" onClick={() => setRegisteringCompany(true)}>Register As Company</button>
            <button className="w-full px-7 py-4 text-xl rounded-xl bg-yellow-300 cursor-pointer" onClick={() => setRegisteringPerson(true)}>Register as Worker</button>
        </div>
        }

        {registeringCompany &&
            <CreateCompany Close={() => setRegisteringCompany(false)}></CreateCompany>
        }

        {registeringPerson &&
            <CreateWorker Close={() => setRegisteringPerson(false)}></CreateWorker>
        }



    </div>)
}

export default Dashboard;