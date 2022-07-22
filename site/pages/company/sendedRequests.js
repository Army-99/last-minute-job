import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import SendedRequest from "../../components/Company/SendedRequest";
import useCredentials from "../../hooks/useCredentials";

const SendedRequests = () => {
    const { isAuthenticated } = useMoralis();
    const { isCompany } = useCredentials();
    const router = useRouter();

    useEffect(() => {
        if(!isAuthenticated){
            router.replace("/");
        }
        else{
            if(isCompany!=null && !isCompany){
                router.replace("/dashboard");
            }
        }
    },[isCompany, isAuthenticated])

    return(
        <>
        {isAuthenticated && isCompany &&
            <SendedRequest></SendedRequest>
        }
        </>
    )
}

export default SendedRequests;