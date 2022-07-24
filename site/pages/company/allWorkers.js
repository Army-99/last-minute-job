import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import Workers from "../../components/Company/Workers";
import useCredentials from "../../hooks/useCredentials";

const AllWorkers = () => {
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
            <Workers />
        }
        </>
    )
}

export default AllWorkers;