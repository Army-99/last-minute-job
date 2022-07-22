import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import useHub from "./useHub";


const useCredentials = () => {
    const { isAuthenticated, isWeb3Enabled, account } = useMoralis();
    const { CheckCompany, CheckWorker } = useHub();
    const [ isCompany, setIsCompany ] = useState(null);
    const [ isWorker, setIsWorker ] = useState(null);

    useEffect( () => {
        if(isAuthenticated && isWeb3Enabled){
            FetchCompanyWorker();
        }
    },[account])

    const FetchCompanyWorker = async() => {
        setIsCompany(await CheckCompany(account));
        setIsWorker(await CheckWorker(account));
    }

    return { isCompany, isWorker };
}

export default useCredentials;