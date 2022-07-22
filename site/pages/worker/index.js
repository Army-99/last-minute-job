import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import useCredentials from "../../hooks/useCredentials";

const Person = () => {
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
        <div className="text-white">Person</div>
    )
}

export default Person;