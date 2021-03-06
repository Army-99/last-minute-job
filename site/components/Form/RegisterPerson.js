import { useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import { contractABI, ContractAddress } from "../../Contract/datas";
import { useRouter } from 'next/router';

const RegisterPerson = ({MainHandler, Close}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const { Moralis } = useMoralis();
    const router = useRouter();

    const name = useRef();
    const nameError = useRef();

    const surname= useRef();
    const surnameError = useRef();

    const mobile = useRef();
    const mobileError = useRef();

    const age = useRef();
    const ageError = useRef();

    const cv = useRef();
    const cvError = useRef();

    const coverl = useRef();
    const coverlError = useRef();

    const RegisterPerson = async() => {
        setIsLoading(true);
        setErrorMessage();
        let options = {
            contractAddress: ContractAddress,
            functionName: "RegisterAsPerson",
            abi: contractABI,
            params: {
            _name: name.current.value,
            _surname: surname.current.value,
            _age: age.current.value,
            _mobilePhone: mobile.current.value,
            _CV: cv.current.value,
            _coverLetter: coverl.current.value
            },
        };
        try{
          const tx = await Moralis.executeFunction(options);
          await tx.wait();
          router.reload(window.location.pathname);
        }catch(err){
            console.log(err.message);
            setErrorMessage(err);
        }
        setIsLoading(false);
    }

    const Handler = (e) => {
        let error=false;
        e.preventDefault();
        if(!name.current.value){
            error=true;
            nameError.current.className = "text-red-500 text-xs italic";
        }else nameError.current.className = "hidden";

        if(!surname.current.value){
            error=true;
            surnameError.current.className = "text-red-500 text-xs italic";
            
        }else surnameError.current.className = "hidden";

        if(!mobile.current.value){
            error=true;
            mobileError.current.className = "text-red-500 text-xs italic";
        }else mobileError.current.className = "hidden";

        if(!age.current.value){
            error=true;
            ageError.current.className = "text-red-500 text-xs italic";

        }else ageError.current.className = "hidden";

        if(!cv.current.value){
            error=true;
            cvError.current.className = "text-red-500 text-xs italic";
        }else cvError.current.className = "hidden";

        if(!coverl.current.value){
          error=true;
          coverlError.current.className = "text-red-500 text-xs italic";
        }else coverlError.current.className = "hidden";

        if(!error){
            RegisterPerson();
        }
    }

    return(
        <form className="w-full max-w-lg bg-opacity-90" onSubmit={Handler}>
            <div className="flex justify-end">
                <button className="text-red-500 p-3 hover:text-white hover:bg-red-500 rounded-full" onClick={Close}>CLOSE</button>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Name
                </label>
                <input ref={name} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Name" />
                <p ref={nameError} className="hidden">Please fill out the name.</p>
              </div>

              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Surname
                </label>
                <input ref={surname} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Surname" />
                <p ref={surnameError} className="hidden">Please fill out the surname.</p>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6 ">
              <div className="w-full px-3 md:w-1/3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" f>
                  Mobile Phone
                </label>
                <input ref={mobile} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Mobile Phone" />
                <p ref={mobileError} className="hidden">Please fill out the mobile phone.</p>
              </div>

              <div className="w-full px-3 md:w-1/3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" f>
                  Age
                </label>
                <input ref={age} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="number" min="16" max="90" placeholder="Age" />
                <p ref={ageError} className="hidden">Please fill out the age.</p>
              </div>

              <div className="w-full px-3 md:w-1/3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" f>
                  CV
                </label>
                <input ref={cv} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="CV" />
                <p ref={cvError} className="hidden">Please fill out the cv.</p>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6 ">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" f>
                  Cover Letter
                </label>
                <textarea ref={coverl} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Cover Letter" />
                <p ref={coverlError} className="hidden">Please fill out the cover letter.</p>
              </div>
            </div>


            <div className="flex justify-center mb-5">
                <div>
                {!isLoading ? <button type="submit" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button> : <div className="text-white">LOADING</div>}
                </div>
            </div>

            <div className="flex justify-center w-full">
                {!!errorMessage && <p className="text-red-500 text-xs italic w-full">{errorMessage.message}</p>}
            </div>
            
            
          </form>
    )
}

export default RegisterPerson;