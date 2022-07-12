import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import CompanyJobs from "../../components/Company/CompanyJobs";
import useCompany from "../../hooks/useCompany";
import useCounters from "../../hooks/useCounters";

const MyJobs = () => {
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
        <>
        {isCompany && <CompanyJobs></CompanyJobs>}
        </>
    )
}

export default MyJobs;