import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import ShowAllJobs from "../../components/Worker/ShowAllJobs";
import usePerson from "../../hooks/usePerson";

const AllJobs = () => {
    const { isAuthenticated } = useMoralis();
    const { isPerson } = usePerson();
    const router = useRouter();

    useEffect(() => {

        if(!isAuthenticated)
            if (!isAuthenticated) router.replace("/");
        
        if(isPerson!=null  && !isPerson)
            if (!isPerson) router.replace("/dashboard");
    },[isPerson, isAuthenticated])

    return(
        <ShowAllJobs />
    );
}

export default AllJobs;