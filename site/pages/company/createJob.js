import CreateForm from "../../components/Form/CreateForm";
import { useMoralis } from "react-moralis";
import useCompany from "../../hooks/useCompany";
import { useRouter } from "next/router";
import { useEffect } from "react";


const CreateJob = () => {
    const { isAuthenticated } = useMoralis();
    const { isCompany } =useCompany();
    const router = useRouter();

    useEffect(() => {
        if(!isAuthenticated)
            if (!isAuthenticated) router.replace("/");
        if(isCompany!=null  && !isCompany)
            if (!isCompany) router.replace("/dashboard");
    },[isCompany, isAuthenticated])
    return(
        <div className="text-black flex h-screen w-screen items-center justify-center overflow-y-auto scrollbar-hide" >
        <CreateForm></CreateForm>
    </div>
    ); 
}

export default CreateJob;