import react from "react"
import {PiArrowUpLight} from "react-icons/pi"
import {PiArrowDownLight} from "react-icons/pi"


interface Props{
    tit:string,
    Ic:any,
    Cl:any,
    fig:string,
    increment:any,
}


const Card:React.FC<Props>=({tit,fig,increment,Ic,Cl})=>{
    return(
       <div className="w-[200px] h-[150px] rounded-[5px] bg-[#fff] flex justify-center items-center px-[15px] shadow-2xl">
          <div className="w-[98%] h-[100%] flex flex-col justify-around">
          <div className="text-[13px]">{tit}</div>
            <div className="text-[22px] font-medium">{fig}</div>
            <div className="w-[100%] flex justify-between items-center">
                <div className="w-[40px] flex justify-center items-center">
                    <div className={`${increment >= "3.00%" ? 'text-[#44ce4b]' : 'text-red-700'}`}>
                        {increment >= "3.00%" ? <PiArrowUpLight/> : <PiArrowDownLight/>}
                    </div>
                    <div  className={`${increment >= "3.00%" ? 'text-[#44ce4b]' : 'text-red-700'}`}>{increment}</div>
                    </div>
                <div className="text-[10px]">Since last week</div>
            </div>
          </div>
       </div>
    )
}
export default Card;