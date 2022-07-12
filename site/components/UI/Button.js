import { Loader } from './Loader'

const Button = (props) => {

    //console.log(props.Loading)
    return(
        <>
        {!props.Loading ? 
            <button onClick={props.onClick} className="text-xs uppercase px-2 py-1 rounded-full border border-gray-200 font-bold text-green-600 hover:bg-green-500 hover:text-gray-200">
            {props.children}
        </button>
        :
        <div className="text-white">
            LOADING
        </div>
        }
        
        
        </>
        
    );
}

export default Button;