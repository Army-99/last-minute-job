import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import IncomingRequest from "../../components/Worker/IncomingRequests";
import usePerson from "../../hooks/usePerson";

const IncomingRequests = () => {
    const { isAuthenticated } = useMoralis();
    const { isPerson } = usePerson();
    const router = useRouter();

    useEffect(() => {
        if(!isAuthenticated)
            router.replace("/");
        if(isPerson!=null  && !isPerson)
            router.replace("/dashboard");
    },[isPerson, isAuthenticated])

    return(
        <IncomingRequest></IncomingRequest>
    );
}

export default IncomingRequests;