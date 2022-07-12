import { useRouter } from "next/router";
import { useEffect } from "react"
import { useMoralis } from "react-moralis";
import usePerson from "../../hooks/usePerson";

const Person = () => {
    const { isAuthenticated } = useMoralis();
    const { isPerson } = usePerson();
    const router = useRouter();

    useEffect(() => {

        
        if(!isAuthenticated)
            if (!isAuthenticated) router.replace("/");
        if(isPerson!==null  && !isPerson)
        {
            //console.log(isPerson)
            if (!isPerson) router.replace("/dashboard");
        }
            
    },[isPerson, isAuthenticated])

    return(
        <div className="text-white">Person</div>
    )
}

export default Person;