import { forwardRef, useImperativeHandle, useRef } from "react";

const InputSplit = forwardRef((props, ref) =>
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
        <div className={`${props.width} w-full px-3 md:mb-0`}>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"> {props.value} </label>
            <input ref={inputRef} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type={props.type} />
            <p ref={labelRef} className="hidden">Please fill out the {props.value}.</p>
        </div>
    )
})


export default InputSplit;