import React from "react"
import ComplianceDetails from "../compliance/ComplianceDetails";

interface Data{
    storeId:string,
    agentId:string,
    category:string,
    name:string,
    agentName:string,
    timeDate:string,
}


const Card:React.FC<Data> =({storeId,agentId,category,name,agentName,timeDate})=>{


   const [show,setShow] = React.useState(false);
   const togleBtn=()=>{
    setShow(!show)
   }
    return (
			<div className='w-[320px]  rounded-[5px] flex justify-center items-center bg-[#ddd] mb-[20px] '>
				<div className='w-[96%]   flex flex-col py-[10px] px-[10px]'>
					<div className='flex items-center mb-[15px]'>
						<div className='text-[13px] font-bold mr-[10px]'>Store ID:</div>
						<div className='text-[14px] text-[#0000ff]'>{storeId}</div>
					</div>
					<div className='flex items-center mb-[15px]'>
						<div className='text-[13px] font-bold mr-[10px]'>Agent ID:</div>
						<div className='text-[14px] text-[#0000ff]'>{agentId}</div>
					</div>
					<div className='flex items-center mb-[15px]'>
						<div className='text-[13px] font-bold mr-[10px]'>
							Complaint Category:
						</div>
						<div className='text-[14px] text-[#0000ff]'>{category}</div>
					</div>
					<div className='flex items-center mb-[15px]'>
						<div className='text-[13px] font-bold mr-[10px]'>Store Name:</div>
						<div className='text-[14px] text-[#0000ff]'>{name}</div>
					</div>
					<div className='flex items-center mb-[15px]'>
						<div className='text-[13px] font-bold mr-[10px]'>Agent Name:</div>
						<div className='text-[14px] text-[#0000ff]'>{agentName}</div>
					</div>
					<div className='flex items-center mb-[15px]'>
						<div className='text-[13px] font-bold mr-[10px] text-[#818181]'>
							Time|Date:
						</div>
						<div className='text-[14px] text-[#818181]'>{timeDate}</div>
					</div>
					{/* <div className="w-[100%] flex justify-center items-center mt-[10px]"> */}
					<button
						className='w-[130px] z-10 cursor-pointer flex justify-center items-center rounded-[5px] py-[5px] bg-[white]  border-solid border-[#0000ff] border-[1px]'
						onClick={togleBtn}>
						<div className='text-[#0000ff] text-[14px]'>View More</div>
					</button>
					{/* </div> */}
				</div>
				{show ? (
					<div>
						<ComplianceDetails togleBtn={togleBtn} />
					</div>
				) : null}
			</div>
		);
}
export default Card;