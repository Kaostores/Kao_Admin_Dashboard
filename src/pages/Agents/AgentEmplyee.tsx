import React from "react"
import { BsPersonAdd } from "react-icons/bs"
import AgentDetails from "@/components/agents/AgentsDetails"
import AgentSec from "@/components/props/AgentsSec"
const Agents=()=>{

    const [show,setShow] = React.useState(false);
    const togleBtn=()=>{
     setShow(!show)
    }

    return(
        <div className='w-[100%] h-[100%]  bg-[#fff] pl-[20px] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px] xl:w-[calc(100%-280px)] xl:h-[calc(100%-70px)]'>
            <div className='w-[97%] h-[100%] flex  items-center flex-col'>
                <div className="w-[100%] h-[100px] flex justify-between items-center">
                    <div>Agents</div>
                    <div className="w-[160px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] pr-[8px]">
                        <div className="bg-[#0333ae] text-white h-[100%] w-[30px] flex justify-center items-center">
                            <BsPersonAdd/>
                        </div>
                        <div className="text-[#0333ae] text-[15px] font-semibold cursor-pointer z-0" onClick={togleBtn}>Add Employee</div>
                    </div>
                </div>
                <div className="w-[100%] h-[100%] flex justify-center items-center flex-col z-0">
                    <AgentSec name="jon snow stack" add="Small Village" order="23546487" pnumb='+123 9057287824' lastlogin="11:29 AM 20-02-2024"/>
                </div>
            </div>
            {
                show ? (
                    <AgentDetails togleBtn={togleBtn}/>
                ) : null
            }
        </div>
    )
}
export default Agents;