import Head from 'next/head';
import { useMoralis } from "react-moralis";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ConnectWallet from '../components/ConnectWallet';
import useCredentials from '../hooks/useCredentials';

export default function Home() {
  const { isCompany, isWorker } = useCredentials();
  const { isAuthenticated} = useMoralis();
  const router = useRouter(); 

  useEffect(() => {
    if(isCompany) router.replace("/company");
    if(isWorker) router.replace("/worker");
    if (isAuthenticated && !isCompany && isCompany!=null && !isWorker && isWorker!=null) router.replace("/dashboard");
  }, [isAuthenticated, isCompany, isWorker]);


  return (
    <>
      <Head>
        <title>Last Minute Job</title>
        <meta name="description" content="Search a job and be hired" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    
      <ConnectWallet></ConnectWallet>

     {/* FOOTER */}
    </>
  )
}
