import Input from "../UI/Input";
import InputSplit from "../UI/InputSplit";
import Button from "../UI/Button";
import { useRef, useState } from "react";
import useRequest from "../../hooks/useRequest";
import Loader from "../UI/Loader";

const ModalCreateRequest = ({addressWorker, close}) => {
    const { errorRequest, isLoadingRequest, CreateRequest } = useRequest();

    const AmountRef = useRef();
    const TitleRef = useRef();
    const WAddRef = useRef();
    const DescRef = useRef();
    const HourIRef = useRef();
    const HourFRef = useRef();
    const DateIRef = useRef();
    const DateFRef = useRef();
    const MessageRef = useRef();

    const Handler = async(e) => {
        e.preventDefault();

        let error=false;

        if(!AmountRef.current.input.value || AmountRef.current.input.value<=0 || isNaN(AmountRef.current.input.value)){
            error=true;
            AmountRef.current.label.className = "text-red-500 text-xs italic";
        }else AmountRef.current.label.className = "hidden";

        if(!TitleRef.current.input.value){
            error=true;
            TitleRef.current.label.className = "text-red-500 text-xs italic";
        }else TitleRef.current.label.className = "hidden";

        if(!WAddRef.current.input.value){
            error=true;
            WAddRef.current.label.className = "text-red-500 text-xs italic";
        }else WAddRef.current.label.className = "hidden";

        if(!DescRef.current.input.value ){
            error=true;
            DescRef.current.label.className = "text-red-500 text-xs italic";
        }else DescRef.current.label.className = "hidden";

        if(!HourIRef.current.input.value){
            error=true;
            HourIRef.current.label.className = "text-red-500 text-xs italic";
        }else HourIRef.current.label.className = "hidden";

        if(!HourFRef.current.input.value){
            error=true;
            HourFRef.current.label.className = "text-red-500 text-xs italic";
        }else HourFRef.current.label.className = "hidden";

        if(!DateIRef.current.input.value){
            error=true;
            DateIRef.current.label.className = "text-red-500 text-xs italic";
        }else DateIRef.current.label.className = "hidden";

        if(!DateFRef.current.input.value || DateFRef.current.input.value <= DateIRef.current.input.value){
            error=true;
            if(DateFRef.current.input.value <= DateIRef.current.input.value)
                DateFRef.current.label.innerText="The end date must be greater than the start date"

            DateFRef.current.label.className = "text-red-500 text-xs italic";
        }else DateFRef.current.label.className = "hidden";

        if(!MessageRef.current.input.value){
            error=true;
            MessageRef.current.label.className = "text-red-500 text-xs italic";
        }else MessageRef.current.label.className = "hidden";

        if(!error)
        {
            const hourInit = Number((HourIRef.current.input.value).split(":")[0]) * 60 + Number((HourIRef.current.input.value).split(":")[1]);
            const hourFinish = Number((HourFRef.current.input.value).split(":")[0]) * 60 + Number((HourFRef.current.input.value).split(":")[1]);

            if(hourFinish <= hourInit)
                hourFinish += 24 * 60;

            //console.log(hourInit, hourFinish)
            
            const dateFrom = Math.floor(new Date(DateIRef.current.input.value).getTime() /1000);
            const dateTo = Math.floor(new Date(DateFRef.current.input.value).getTime() /1000);


            const title = TitleRef.current.input.value;
            const description = DescRef.current.input.value;
            const workingAddress = WAddRef.current.input.value;
            const message = MessageRef.current.input.value;
            const value = AmountRef.current.input.value;

            //const CreateRequest = async(destination, title, description, workingAddress, hourInit, hourFinish, dateFrom, dateTo, message, value) => {
            const tx = await CreateRequest(addressWorker, title, description, workingAddress, hourInit, hourFinish, dateFrom, dateTo, message, value)
            if(tx)
            {
                close();
            }
        }
    }

    return(
        <>
        <div className="justify-center mt-10 items-center flex overflow-x-hidden overflow-y-auto scrollbar-hide
                        fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto mx-auto max-w-4xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg flex flex-col w-full bg-gray-200 outline-none focus:outline-none mb-5 mt-48">

                        {/*header*/}
                        <div className="items-center  justify-center p-5 border-b border-solid border-black rounded-t text-black">
                            <h3 className="text-3xl font-semibold text-center">
                                Send Request
                            </h3>
                        </div>
                        
                        {/*body*/}
                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-black mt-5">

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
                        </div>

                        {/*footer*/}
                        <div className="flex justify-center p-6 border-t border-solid border-black rounded-b">
                            {
                                !isLoadingRequest ?
                                <button
                                    className="text-green-500 hover:opacity-80 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={Handler}>
                                    Send
                                </button>
                                :
                                <Loader></Loader>
                            }
                            

                            {errorRequest && <p>{errorRequest.message}</p>}

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
}

export default ModalCreateRequest;