import useJob from "../../hooks/useJob";
import Input from "../UI/Input";
import InputSplit from "../UI/InputSplit";

const ModalSendCandidature = ({nrJob, close}) => {

    const { isLoadingJob, errorJob, ApplyToJob } = useJob();

    

    const Handler = async(e) => {
        e.preventDefault();
        console.log("MODAL: " + nrJob);
    };

    return(
        <>
        <div className="justify-center mt-10 items-center flex overflow-x-hidden overflow-y-auto scrollbar-hide
                        fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto mx-auto max-w-4xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg flex flex-col w-full bg-gray-200 outline-none focus:outline-none mb-5 ">

                        {/*header*/}
                        <div className="items-center  justify-center p-5 border-b border-solid border-black rounded-t text-black">
                            <h3 className="text-3xl font-semibold text-center">
                                Send Candidature
                            </h3>
                        </div>
                        
                        {/*body*/}
                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-black mt-5">
{/*
                            <Input value={"Amount"} type={"decimal"} min={0} ref={AmountRef}></Input>
                            <Input value={"Title"} type={"text"} min={0} ref={TitleRef}></Input>
                            <Input value={"Working Address"} type={"text"} min={0} ref={WAddRef}></Input>
                            <Input value={"Description"} type={"text"} min={0} ref={DescRef}></Input>
                            

                            <div className="flex flex-wrap -mx-3 mb-4">
                                <InputSplit value={"Hour Init"} width={"w-1/2"} type={"time"} ref={HourIRef}></InputSplit>
                                <InputSplit value={"Hour Finish"} width={"w-1/2"} type={"time"} ref={HourFRef}></InputSplit>
                            </div>

                            <div className="flex flex-wrap -mx-3 mb-10">
                                <InputSplit value={"Date Init"} width={"sm:w-1/2"} type={"date"} ref={DateIRef}></InputSplit>
                                <InputSplit value={"Date Finish"} width={"sm:w-1/2"} type={"date"} ref={DateFRef}></InputSplit>
                            </div>

                            <Input value={"Message"} type={"text"} min={0} ref={MessageRef}></Input>
*/}
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