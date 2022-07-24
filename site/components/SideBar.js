import { useMoralis } from "react-moralis";
import Link from 'next/link';
import { getEllipsisTxt } from "../helpers/formatters";
import { useMoralisWeb3Api, useNativeBalance  } from "react-moralis";

import {
    HomeIcon
} from "@heroicons/react/outline";
import useCredentials from "../hooks/useCredentials";
import { useEffect } from "react";

const LinkStruct = ({name, href, children}) => { 
    return(
    <Link href={href}>    
        <button className="flex items-center space-x-4 hover:text-white">
            <HomeIcon className="h-5 w-5"></HomeIcon> 
            <p className="w-10">{name}</p>
            <p>{children}</p>
        </button>
    </Link>
    );    
}

const SideBar = ({children}) => {
    const { isAuthenticated, logout, account, chainId } = useMoralis();
    const { isCompany, isWorker } = useCredentials();
    const { data: balance } = useNativeBalance({ chain : chainId, address: account });

    const HandlerLogOut = async() => {
        await logout();
    }

    return(
    <div className='bg-black h-screen overflow-hidden'>
        <main className='flex'>
        {isAuthenticated && 
            <div className="text-gray-500 p-5 text-sm border-r border-gray-900 h-screen" >
                <div className="items-start mb-20">
                    <div className="flex justify-center">
                        <button onClick={HandlerLogOut} className="text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-md ">LOGOUT</button>
                    </div>

                    <div>
                        <p className="text-center text-xl">{isWorker && "Worker"} {isCompany && "Company"}</p>
                    </div>

                    <div>
                        <p className="text-center">{getEllipsisTxt(account)}</p>
                    </div>
                    
                    <div>
                        <p className="text-center">{balance.formatted}</p>
                    </div>
                </div>
                <div className="flex">
                    <div className="space-y-10">
                        <hr className="border-t-[0.1px] border-gray-900"></hr>
                        { isCompany && 
                        <>   
                            <LinkStruct name={"Hire"} href={"/company/allWorkers"}></LinkStruct>
                            <LinkStruct name={"Create Job"} href={"/company/createJob"}></LinkStruct>
                            <LinkStruct name={"My Jobs"} href={"/company/myJobs"}></LinkStruct>
                            <LinkStruct name={"My Requests"} href={"/company/sendedRequests"}></LinkStruct>
                        </>
                        }

                        { isWorker &&
                        <>
                            <LinkStruct name={"Last Applications"} href={"/worker/jobApplications"}></LinkStruct>
                            <LinkStruct name={"Jobs"} href={"/worker/allJobs"}></LinkStruct>
                            <LinkStruct name={"Requests"} href={"/worker/incomingRequests"}></LinkStruct>
                        </>
                        }

                        <hr className="border-t-[0.1px] border-gray-900"></hr>
                    </div>
                </div>
            </div> 
        }
        {children}
        </main>
    </div>
        
    )
}

export default SideBar;