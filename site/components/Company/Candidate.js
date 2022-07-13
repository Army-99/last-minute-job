import HexToDec from "../../helpers/formatters";
import Button from "../UI/Button";
import Input from "../UI/Input";

const Candidate = ({item,proposeHire, isLoading, SetAbsentHours, refHoursAbsent}) => {
    const name = item.value[0];
    const surname = item.value[1];
    const mobilePhone = item.value[2];
    const age = HexToDec (item.value[3]);
    const CV = item.value[4];
    const coverLetter = item.value[5];
    const proposalHire = item.value[6];
    const hired = item.value[7];

    return(
        <div className="w-full">
            <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden text-black m-5">
                <div className="bg-gray-200 text-gray-700 text-lg px-6 py-4">
                    <p className="font-bold">{name} {surname}</p>
                    <p>Age: {age}</p>
                </div>

                <div className="flex justify-between items-center px-6 py-4">
                    {!hired && !proposalHire && <Button Loading={isLoading} onClick={proposeHire}>Hire Question</Button>}
                    {proposalHire && <p>Proposed</p>}
                    {hired && <p>Hired</p>}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 text-black">
                    <p>{coverLetter}</p>
                </div>

                <div className="bg-gray-200 px-6 py-4">
                    <div className="flex">
                        <Input value="Absent hours" type="number" min={0} width={"sm:w-2/3"} ref={refHoursAbsent}></Input>
                        <Button onClick={SetAbsentHours}>Set</Button>
                    </div>
                    <div className="flex">
                        <Button>{CV}</Button>
                        <p>Phone: {mobilePhone}</p>
                    </div>
                    
                </div>
            </div>
        </div>
        );
};

export default Candidate