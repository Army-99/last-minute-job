import CreateForm from "../../components/Form/CreateForm";
import { useMoralis } from "react-moralis";
import useCredentials from "../../hooks/useCredentials";
import { useRouter } from "next/router";
import { useEffect } from "react";


const CreateJob = () => {
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
        <div className="text-black flex h-screen w-screen items-center justify-center overflow-y-auto scrollbar-hide" >
        <CreateForm></CreateForm>
    </div>
    ); 
}

export default CreateJob;