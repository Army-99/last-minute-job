import { useRef, useState } from "react";
import Loader from "../UI/Loader";
import { useRouter } from 'next/router';
import useHub from "../../hooks/useHub";

const RegisterCompany = ({MainHandler, Close}) => {
    const { CreateCompany, isLoadingHub, errorHub } = useHub();

    const router = useRouter();

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

    const Handler = async(e) => {
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
          let nameParam = name.current.value;
          let descParam = description.current.value;
          let addParam = city.current.value + "-" + state.current.value + "-" + zip.current.value;

          const tx = await CreateCompany(nameParam, descParam, addParam);

          if(tx)
            router.reload(window.location.pathname);
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
                {isLoadingHub ?  <Loader></Loader> : <button type="submit" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>}
                </div>
            </div>

            <div className="flex justify-center">
                {errorHub ? <p className="text-red-500 text-xs italic">{errorHub.message}</p> : <></>}
            </div>
            
          </form>
    )
}

export default RegisterCompany;