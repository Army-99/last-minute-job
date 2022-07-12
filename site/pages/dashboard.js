import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from 'next/router';
import RegisterCompany from "../components/Form/RegisterCompany";
import useCompany from "../hooks/useCompany";
import RegisterPerson from "../components/Form/RegisterPerson";
import usePerson from "../hooks/usePerson";

const Dashboard = () => {
    const { isAuthenticated, web3 } = useMoralis();
    const { isCompany} = useCompany();
    const { isPerson } = usePerson();
    const [ registeringPerson, setRegisteringPerson] = useState(false);
    const [ registeringCompany, setRegisteringCompany] = useState(false);
    const router = useRouter(); 

    useEffect(() => {
        const Check = async() => {
            if (!isAuthenticated) router.replace("/");
            if(isCompany) router.replace("/company");
            if(isPerson) router.replace("/worker");
        }
        Check();
    },[isAuthenticated, isCompany, isPerson, web3])

    return(
    <div className="text-black flex h-screen w-screen items-center justify-center" >
        {!registeringCompany && !registeringPerson && isCompany!=null && isPerson!=null && !isPerson && !isCompany
        && 
        <div className="space-y-4">
            <button className="w-full px-7 py-4 text-xl rounded-xl bg-yellow-300 cursor-pointer" onClick={() => setRegisteringCompany(true)}>Register As Company</button>
            <button className="w-full px-7 py-4 text-xl rounded-xl bg-yellow-300 cursor-pointer" onClick={() => setRegisteringPerson(true)}>Register as Person</button>
        </div>
        }

        {registeringCompany &&
            <RegisterCompany Close={() => setRegisteringCompany(false)}></RegisterCompany>
        }

        {registeringPerson &&
            <RegisterPerson Close={() => setRegisteringPerson(false)}></RegisterPerson>
        }



    </div>)
}

export default Dashboard;