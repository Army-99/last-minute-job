import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import Applications from "../../components/Worker/Applications";
import useCounters from "../../hooks/useCounters";
import usePerson from "../../hooks/usePerson";

const JobApplications = () => {
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
        <>
        {isPerson && <Applications />}
        </>
    );
}

export default JobApplications;