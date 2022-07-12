import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import Workers from "../../components/Company/Workers";
import useCompany from "../../hooks/useCompany";

const AllWorkers = () => {
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
        <Workers />
    )
}

export default AllWorkers;