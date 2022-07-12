import { useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import { contractABI, ContractAddress } from "../../Contract/datas";
import { useRouter } from 'next/router';

const RegisterCompany = ({MainHandler, Close}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const router = useRouter();
    const { Moralis } = useMoralis();
    const name = useRef();
    const nameError = useRef();
    const description= useRef();
    const descriptionError = useRef();
    const city = useRef();
    const cityError = useRef();
    const state = useRef();
    const stateError = useRef();
    const zip = useRef();
    const zipError = useRef();

    const RegisterCompany = async() => {
        setIsLoading(true);
        setErrorMessage();
        let options = {
            contractAddress: ContractAddress,
            functionName: "RegisterAsCompany",
            abi: contractABI,
            params: {
            _name: name.current.value,
            _description: description.current.value,
            _address: city.current.value + "-" + state.current.value + "-" + zip.current.value 
            },
        };
        try{
            const transaction = await Moralis.executeFunction(options);
            await transaction.wait(1);
            router.reload(window.location.pathname);
        }catch(err){
            console.log(err.message);
            setErrorMessage(err);
            setIsLoading(false);
        }
        
        setIsLoading(false);
    }

    const Handler = (e) => {
        e.preventDefault();
        let error=false;
        if(!name.current.value){
            error=true;
            nameError.current.className = "text-red-500 text-xs italic";
        }else nameError.current.className = "hidden";

        if(!description.current.value){
            error=true;
            descriptionError.current.className = "text-red-500 text-xs italic";
            
        }else descriptionError.current.className = "hidden";

        if(!city.current.value){
            error=true;
            cityError.current.className = "text-red-500 text-xs italic";
        }else cityError.current.className = "hidden";

        if(!state.current.value){
            error=true;
            stateError.current.className = "text-red-500 text-xs italic";

        }else stateError.current.className = "hidden";

        if(!zip.current.value){
            error=true;
            zipError.current.className = "text-red-500 text-xs italic";
        }else zipError.current.className = "hidden";

        if(!error){
            RegisterCompany();
        }
    }

    return(
        <form className="w-full max-w-lg bg-opacity-90" onSubmit={Handler}>
            <div className="flex justify-end">
                <button className="text-red-500 p-3 hover:text-white hover:bg-red-500 rounded-full" onClick={Close}>CLOSE</button>
                </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Company Name
                </label>
                <input ref={name} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Company Name" />
                
                <p ref={nameError} className="hidden">Please fill out the name.</p>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" f>
                  Company Description
                </label>
                <input ref={description} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Description" />
                <p ref={descriptionError} className="hidden">Please fill out the description.</p>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-10">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  City
                </label>
                <input ref={city} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Rome" />
                <p ref={cityError} className="hidden">Please fill out the city.</p>
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                  State
                </label>
                <input ref={state} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Italy" />
                <p ref={stateError} className="hidden">Please fill out the state.</p>
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Zip
                </label>
                <input ref={zip} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="90210" />
                <p ref={zipError} className="hidden">Please fill out the zip.</p>
              </div>
            </div>

            <div className="flex justify-center mb-5">
                <div>
                {!isLoading ? <button type="submit" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button> : <div className="text-white">LOADING</div>}
                </div>

                
            </div>
            <div className="flex justify-center">
                {!!errorMessage && <p className="text-red-500 text-xs italic">{errorMessage.message}</p>}
            </div>
            
            
          </form>
    )
}

export default RegisterCompany;