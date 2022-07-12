const ModalManageJob = ({job, close}) => {
    return(
        <>
        <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-200 outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-center justify-center p-5 border-b border-solid border-black rounded-t text-black">
                    <h3 className="text-3xl font-semibold">
                        MANAGER
                    </h3>
                    </div>
                    {/*body*/}

                        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-black">
                        
                        </div>

                    {/*footer*/}
                    <div className="flex justify-center p-6 border-t border-solid border-black rounded-b">
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

export default ModalManageJob;