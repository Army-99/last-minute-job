import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import ShowAllJobs from "../../components/Worker/ShowAllJobs";
import useCredentials from "../../hooks/useCredentials";

const AllJobs = () => {
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
        <ShowAllJobs />
    );
}

export default AllJobs;