import { ContractAddress, contractABI } from "../../Contract/datas";
import Input from "../UI/Input";
import InputSplit from "../UI/InputSplit";
import Button from "../UI/Button";
import { useRef, useState } from "react";
import { useMoralis } from "react-moralis";


//destination, dateFrom, dateTo, hourStart, hourFinish, nrCandidate

const ModalCreateRequest = ({addressWorker, close}) => {
    const {Moralis} = useMoralis();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const AmountRef = useRef();
    const HourIRef = useRef();
    const HourFRef = useRef();
    const DateIRef = useRef();
    const DateFRef = useRef();
    const MessageRef = useRef();

    const Handler = () => {
        let error=false;

        if(!AmountRef.current.input.value || AmountRef.current.input.value<=0){
            error=true;
            AmountRef.current.label.className = "text-red-500 text-xs italic";
        }else AmountRef.current.label.className = "hidden";

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
            
            const dateInit = Math.floor(new Date(DateIRef.current.input.value).getTime() /1000);
            const dateFinish = Math.floor(new Date(DateFRef.current.input.value).getTime() /1000);
            CreateRequest(addressWorker, dateInit, dateFinish, hourInit,hourFinish, MessageRef.current.input.value )
            close;
        }
            

    }

    //CreateRequest(address _destination, uint _dateFrom, uint _dateTo,uint _hourStart,uint _hourFinish, string memory _message)

  const CreateRequest = async(destination, dateFrom, dateTo, hourStart, hourFinish, message) => {
    setIsLoading(true);
    let options = {
      contractAddress: ContractAddress,
      functionName: "CreateRequest",
      abi: contractABI,
      params: {
          _destination: destination,
          _dateFrom: dateFrom,
          _dateTo: dateTo,
          _hourStart: hourStart,
          _hourFinish: hourFinish,
          _message: message
      },
      msgValue: Moralis.Units.ETH(AmountRef.current.input.value)
    };
    try{
      const transaction = await Moralis.executeFunction(options);
      await transaction.wait()
    }catch(err){
      console.error(err)
      setError(err);
    }
    setIsLoading(false);
    return null;
  }



    return(
        <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto
                        fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-200 outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-center justify-center p-5 border-b border-solid border-black rounded-t text-black">
                    <h3 className="text-3xl font-semibold">
                        Send Request
                    </h3>
                    </div>
                    {/*body*/}

                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-black">
                        <Input value={"Amount"} type={"decimal"} min={0} ref={AmountRef}></Input>

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
                        <Button onClick={Handler} Loading={isLoading}>Send</Button>
                        {error && <p>{error}</p>}
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