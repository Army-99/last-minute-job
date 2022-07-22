import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import CompanyJobs from "../../components/Company/CompanyJobs";
import useCredentials from "../../hooks/useCredentials";

const MyJobs = () => {
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
        {isCompany && <CompanyJobs></CompanyJobs>}
        </>
    )
}

export default MyJobs;