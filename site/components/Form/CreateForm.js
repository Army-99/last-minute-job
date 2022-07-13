import { useCallback, useState } from "react";
import Input from "../UI/Input";
import Loader from "../UI/Loader";
import { ContractAddress, contractABI } from "../../Contract/datas";

import { useMoralis } from "react-moralis";
import { useRef } from "react";
import InputSplit from "../UI/InputSplit";
import { useRouter } from 'next/router';

const CreateForm = () => {
    const { Moralis } = useMoralis();
    const router = useRouter();


    const TitleRef = useRef();
    const DescriptionRef = useRef();
    const WorkingAddRef= useRef();
    const RoleRef= useRef();

    const CounterToHireRef= useRef();
    const ValueRef= useRef();

    const HourIRef=useRef();
    const HourFRef = useRef();

    const DateIRef=useRef();
    const DateFRef = useRef();

    const CreateJob = async() => {
        setIsLoading(true);
        setErrorMessage();

        const hourInit = Number((HourIRef.current.input.value).split(":")[0]) *60 + Number((HourIRef.current.input.value).split(":")[1]);
        const hourFinish = Number((HourFRef.current.input.value).split(":")[0]) *60 + Number((HourFRef.current.input.value).split(":")[1]);

        if(hourFinish <= hourInit)
            hourFinish += 24 * 60;

        //console.log(hourInit, hourFinish)
        
        const dateInit = Math.floor(new Date(DateIRef.current.input.value).getTime() /1000);
        const dateFinish = Math.floor(new Date(DateFRef.current.input.value).getTime() /1000);
        //console.log(dateInit, dateFinish);

        let options = {
            contractAddress: ContractAddress,
            functionName: "CreateJob",
            abi: contractABI,
            params: {
                _title: `${TitleRef.current.input.value}`,
                _description: `${DescriptionRef.current.input.value}`,
                _workingAddress: `${WorkingAddRef.current.input.value}`,
                _searchingPosition: `${RoleRef.current.input.value}`,
                _hourInit: hourInit,
                _hourFinish: hourFinish,
                _peopleToHire: Number(CounterToHireRef.current.input.value),
                _dateFrom: dateInit,
                _dateTo: dateFinish
            },
            
            msgValue: Moralis.Units.ETH(ValueRef.current.input.value),
        };
        try{
            const tx = await Moralis.executeFunction(options);
            await tx.wait();
            router.push("/company/myJobs");
        }catch(err){
            console.log(err);
            setErrorMessage(err);
        }
        
        setIsLoading(false);

    }

    const Handler = (e) => {
        e.preventDefault();
        let error=false;

        //INPUT Checks
        if(!TitleRef.current.input.value){
            error=true;
            TitleRef.current.label.className = "text-red-500 text-xs italic";
        }else TitleRef.current.label.className = "hidden";

        if(!DescriptionRef.current.input.value){
            error=true;
            DescriptionRef.current.label.className = "text-red-500 text-xs italic";
        }else DescriptionRef.current.label.className = "hidden";

        if(!WorkingAddRef.current.input.value){
            error=true;
            WorkingAddRef.current.label.className = "text-red-500 text-xs italic";
        }else WorkingAddRef.current.label.className = "hidden";

        if(!RoleRef.current.input.value){
            error=true;
            RoleRef.current.label.className = "text-red-500 text-xs italic";
        }else RoleRef.current.label.className = "hidden";

        if(!HourIRef.current.input.value){
            error=true;
            HourIRef.current.label.className = "text-red-500 text-xs italic";
        }else HourIRef.current.label.className = "hidden";

        if(!HourFRef.current.input.value){
            error=true;
            HourFRef.current.label.className = "text-red-500 text-xs italic";
        }else HourFRef.current.label.className = "hidden";
        
        if(!CounterToHireRef.current.input.value || CounterToHireRef.current.input.value<1){
            error=true;
            if(CounterToHireRef.current.input.value<1)
            CounterToHireRef.current.label.innerText="The number must be positive"
            CounterToHireRef.current.label.className = "text-red-500 text-xs italic";
        }else CounterToHireRef.current.label.className = "hidden";

        if(!ValueRef.current.input.value || ValueRef.current.input.value<0){
            error=true;
            if(ValueRef.current.input.value<0)
                ValueRef.current.label.innerText="The number must be positive"
            ValueRef.current.label.className = "text-red-500 text-xs italic";
        }else ValueRef.current.label.className = "hidden";

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

        if(!error){
            CreateJob();
        }
    }

    const [isLoading, setIsLoading] = useState();
    const [errorMessage, setErrorMessage] = useState();

    return(
        <div className="h-screen ">
            <h1 className="text-white text-center text-2xl mb-5 uppercase mt-2">CREATE A JOB</h1>
            <form className="w-full max-w-lg bg-opacity-90 " onSubmit={Handler}>
                {/* SIZE OF INPUT WHERE MEDIA SCREEN > 600PX, IF SM FULL WIDTH */}
                <Input value={"Title"} width={"sm:w-2/3"} type={"text"} ref={TitleRef}></Input>
                <Input value={"Description"} width={""} type={"text"} ref={DescriptionRef}></Input>
                <Input value={"Address of Work"} width={"sm:w-2/3"} type={"text"} ref={WorkingAddRef}></Input>
                <Input value={"Search Position"} width={"sm:w-2/3"} type={"text"} ref={RoleRef}></Input>

                {/* FOR SPLIT IN SAME ROW */}
                <div className="flex flex-wrap -mx-3 mb-4">
                    <InputSplit value={"People To hire"} width={"w-1/2"} type={"number"} ref={CounterToHireRef}></InputSplit>
                    <InputSplit value={"Value ETH"} width={"w-1/2"} type={"decimal"} ref={ValueRef}></InputSplit>
                </div>

                <div className="flex flex-wrap -mx-3 mb-4">
                    <InputSplit value={"Hour Init"} width={"w-1/2"} type={"time"} ref={HourIRef}></InputSplit>
                    <InputSplit value={"Hour Finish"} width={"w-1/2"} type={"time"} ref={HourFRef}></InputSplit>
                </div>

                <div className="flex flex-wrap -mx-3 mb-10">
                    <InputSplit value={"Date Init"} width={"sm:w-1/2"} type={"date"} ref={DateIRef}></InputSplit>
                    <InputSplit value={"Date Finish"} width={"sm:w-1/2"} type={"date"} ref={DateFRef}></InputSplit>
                </div>

                <div className="flex justify-center mb-5">
                    <div>
                    {!isLoading ? <button type="submit" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button> : <Loader></Loader>}
                    </div> 
                </div>

                <div className="flex justify-center">
                    {!!errorMessage && <p className="text-red-500 text-xs italic">{errorMessage.message}</p>}
                </div>
            </form>
        </div>
    );
} 
export default CreateForm;