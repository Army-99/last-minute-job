
import Button from "./UI/Button";
import { useState, useRef } from "react";
import { useMoralis } from "react-moralis";
import HexToDec from "../helpers/formatters";
import useRequest from "../hooks/useRequest";
import Input from "./UI/Input"

//destination, dateFrom, dateTo, hourStart, hourFinish, nrCandidate

const ModalShowMessages = ({messages, close, nrRequest, active}) => {
    const [error, setError] = useState(false);
    const { SendMessage, isLoadingRequest, is } = useRequest();
    const messageRef = useRef();

    const HandlerSendMessage = async(e) => {
        e.preventDefault();
        if(!messageRef.current.input.value){
            error=true;
            messageRef.current.label.className = "text-red-500 text-xs italic";
        }else {
            messageRef.current.label.className = "hidden"
            await SendMessage(nrRequest, messageRef.current.input.value);
            close();
        }
    }

    return(
        <>
        <div className="justify-center items-center flex overflow-y-auto h-screen scrollbar-hide
                        fixed inset-0 z-50 outline-none focus:outline-none ">
                <div className="relative w-auto mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-200 outline-none focus:outline-none mt-48">
                        {/*header*/}
                        <div className="flex items-center justify-center p-5 border-b border-solid border-black rounded-t text-black">
                            <h3 className="text-3xl font-semibold">
                                Messages
                            </h3>
                        </div>
                        {/*body*/}

                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-black">
                            {messages.map((item,k) => {
                                const owner = item[0];
                                const destination  = item[1];
                                const message = item[2];
                                const date = new Date(HexToDec(item[3])*1000);
                                return(
                                    <div key={k} className={"border-solid border-t border-b border-gray-500"}>
                                        <p>From: {owner}</p>
                                        <p>To: {destination}</p>
                                        <p>{message}</p>
                                        <p>{date.getDate() + '/' + date.getMonth() + '/' +date.getFullYear()}</p>
                                    </div>
                                )
                                }
                            )}
                        </div>

                        {/*footer*/}
                        <div className="flex justify-center p-6 border-t border-solid border-black rounded-b">
                            {active && <>
                                            <Input ref={messageRef} value="New Message"></Input>
                                            <Button onClick={HandlerSendMessage} Loading={isLoadingRequest}>Send</Button>
                                            {error && <p>{error}</p>}
                                        </>
                            }
                            <button
                                className="text-red-500 hover:opacity-80 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => close()}>
                                    CLOSE
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>

    );
}

export default ModalShowMessages;