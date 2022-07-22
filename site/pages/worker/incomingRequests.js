import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import IncomingRequest from "../../components/Worker/IncomingRequests";
import useCredentials from "../../hooks/useCredentials";

const IncomingRequests = () => {
    const { isAuthenticated } = useMoralis();
    const { isWorker } = useCredentials();
    const router = useRouter();

    useEffect(() => {
        if(!isAuthenticated){
            router.replace("/");
        }else{
            if(isWorker!=null  && !isWorker)
                router.replace("/dashboard");
        }
    },[isWorker, isAuthenticated])

    return(
        <IncomingRequest></IncomingRequest>
    );
}

export default IncomingRequests;