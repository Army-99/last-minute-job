import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import useCredentials from "../../hooks/useCredentials";

const Company = () => {
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
        {
            isCompany && (
                <div className="text-white">COMPANY</div>
            )
        }
        </>
    )
}

export default Company;