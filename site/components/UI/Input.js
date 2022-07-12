import { forwardRef, useImperativeHandle, useRef } from "react";

const Input = forwardRef((props, ref) =>
{
  const labelRef = useRef();
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    get input() {
        return inputRef.current;
    },
    get label() {
        return labelRef.current;
    },

  }));

    return(
          <div className="flex flex-wrap -mx-3 mb-2 ">
              <div className={`w-full ${props.width} px-3 mb-0`}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{props.value}</label>
                <input ref={inputRef} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type={props.type} placeholder={props.value} />
                <p ref={labelRef} className="hidden">Please fill out the {props.value}.</p>
              </div>
          </div>
          )
})


export default Input;