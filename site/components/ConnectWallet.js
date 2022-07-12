import { useMoralis } from "react-moralis";

const ConnectWallet = () => { 
    const { authenticate } = useMoralis();

    const handlerAuth = async(e) => {
        e.preventDefault;
        
        try{
        authenticate();
        }catch(err){
          console.log(err)
        }
    }

    return(
        <div className="flex h-screen w-screen items-center justify-center">
        <div className="space-y-10">
          <h1 className='text-2xl m-5 text-white text-center'>Welcome in Workland</h1>
          <div className='w-full'>
            <button onClick={handlerAuth}
            className="w-full px-7 py-4 text-xl rounded-xl bg-yellow-300 animate-pulse cursor-pointer">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
}

export default ConnectWallet;