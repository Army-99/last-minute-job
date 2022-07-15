import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import SendedRequest from "../../components/Company/SendedRequest";
import useCompany from "../../hooks/useCompany";

const SendedRequests = () => {
    const { isAuthenticated } = useMoralis();
    const { isCompany } = useCompany();
    const router = useRouter();

    useEffect(() => {
        if(!isAuthenticated && isAuthenticated!=null)
            router.replace("/");
        if(isCompany!=null  && !isCompany)
            router.replace("/dashboard");
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