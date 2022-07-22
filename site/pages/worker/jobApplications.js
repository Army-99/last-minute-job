import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import Applications from "../../components/Worker/Applications";
import useCredentials from "../../hooks/useCredentials";

const JobApplications = () => {
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
        <>
        {isWorker && <Applications />}
        </>
    );
}

export default JobApplications;