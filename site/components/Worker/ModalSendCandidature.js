import { useRef } from "react";
import { useMoralis } from "react-moralis";
import useJob from "../../hooks/useJob";
import Input from "../UI/Input";
import InputSplit from "../UI/InputSplit";
import Loader from "../UI/Loader";

const ModalSendCandidature = ({nrJob, close}) => {

    const { isLoadingJob, errorJob, ApplyToJob } = useJob();
    const { account }  = useMoralis();

    const nameRef = useRef();
    const surnameRef = useRef();
    const mobilePhoneRef = useRef();
    const CVRef = useRef();
    const coverLetterRef = useRef();
    const ageRef = useRef();

    const Handler = async(e) => {
        e.preventDefault();

        let error=false;

        if(!nameRef.current.input.value){
            error=true;
            nameRef.current.label.className = "text-red-500 text-xs italic";
        }else nameRef.current.label.className = "hidden";

        if(!surnameRef.current.input.value){
            error=true;
            surnameRef.current.label.className = "text-red-500 text-xs italic";
        }else surnameRef.current.label.className = "hidden";

        if(!mobilePhoneRef.current.input.value){
            error=true;
            mobilePhoneRef.current.label.className = "text-red-500 text-xs italic";
        }else mobilePhoneRef.current.label.className = "hidden";

        if(!CVRef.current.input.value){
            error=true;
            CVRef.current.label.className = "text-red-500 text-xs italic";
        }else CVRef.current.label.className = "hidden";

        if(!coverLetterRef.current.input.value){
            error=true;
            coverLetterRef.current.label.className = "text-red-500 text-xs italic";
        }else coverLetterRef.current.label.className = "hidden";

        if(!ageRef.current.input.value){
            error=true;
            ageRef.current.label.className = "text-red-500 text-xs italic";
        }else ageRef.current.label.className = "hidden";

        if(!error){
            let name = nameRef.current.input.value;
            let surname = surnameRef.current.input.value;
            let mobPhone = mobilePhoneRef.current.input.value;
            let CV = CVRef.current.input.value;
            let coverLetter = coverLetterRef.current.input.value;
            let age = ageRef.current.input.value;

            const tx = await ApplyToJob(account, nrJob, name, surname, mobPhone, CV, coverLetter, age);
            if(tx)
                close();
        }

    };

    return(
        <>
        <div className="justify-center mt-10 items-center flex overflow-x-hidden overflow-y-auto scrollbar-hide
                        fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto mx-auto max-w-4xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg flex flex-col w-full bg-gray-200 outline-none focus:outline-none mb-5 ">

                        {/*header*/}
                        <div className="items-center  justify-center p-5 border-b border-solid border-black rounded-t text-black mt-14">
                            <h3 className="text-3xl font-semibold text-center">
                                Send Candidature
                            </h3>
                        </div>
                        
                        {/*body*/}
                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-black mt-5">

                            <Input value={"Name"} type={"text"} ref={nameRef}></Input>
                            <Input value={"Surname"} type={"text"} ref={surnameRef}></Input>
                            <Input value={"Mobile Phone"} type={"text"} ref={mobilePhoneRef}></Input>
                            <Input value={"CV"} type={"text"} ref={CVRef}></Input>
                            <Input value={"Cover Letter"} type={"text"} ref={coverLetterRef}></Input>
                            <Input value={"Age"} type={"number"} ref={ageRef} min={16}></Input>
                        </div>

                        {/*footer*/}
                        <div className="flex justify-center p-6 border-t border-solid border-black rounded-b">
                            {
                                !isLoadingJob ?
                                <button
                                    className="text-green-500 hover:opacity-80 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={Handler}>
                                    Send
                                </button>
                                :
                                <Loader></Loader>
                            }
                            

                            {errorJob && <p>{errorJob.message}</p>}

                            <button
                                className="text-red-500 hover:opacity-80 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => close()}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ModalSendCandidature;