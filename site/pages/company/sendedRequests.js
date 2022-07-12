import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import useCompany from "../../hooks/useCompany";

const SendedRequests = () => {
    const { isAuthenticated } = useMoralis();
    const { isCompany } = useCompany();
    const router = useRouter();

    useEffect(() => {
        if(!isAuthenticated)
            if (!isAuthenticated) router.replace("/");
        if(isCompany!=null  && !isCompany)
            if (!isCompany) router.replace("/dashboard");
    },[isCompany, isAuthenticated])

    return(
        <div className="text-white">Sended Requests</div>
    )
}

export default SendedRequests;