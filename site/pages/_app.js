import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";
import SideBar from '../components/SideBar';
//import { MainProvider } from '../context/MainContext';

function MyApp({ Component, pageProps }) {
 
  return (
  <MoralisProvider appId={process.env.NEXT_PUBLIC_APP_ID} serverUrl={process.env.NEXT_PUBLIC_SERVER_URL} >
        <SideBar>
          <Component {...pageProps} />
        </SideBar>
  </MoralisProvider>
  )
}

export default MyApp
