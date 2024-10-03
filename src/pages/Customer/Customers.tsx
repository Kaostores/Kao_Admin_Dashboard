import React from "react"
import Customer from "@/components/props/Customers"
import CustomersDetails from "@/components/customer/CustomersDetails"

const Customers=()=>{

    const [show,setShow] = React.useState(false);
    const togleBtn=()=>{
     setShow(!show)
    }

    

    return(
        <div className='w-[95%] h-[100%] flex justify-center items-center pb-[30px]'>
            <div className='w-[100%] h-[100%] flex  items-center flex-col z-[50]'>
                <div className="w-[100%] h-[100%] flex justify-center items-center flex-col">
                    <Customer />
                </div>
            </div>
            {
                show ? (
                   < CustomersDetails togleBtn={togleBtn} />
                ):null
            }
        </div>
    )
}
export default Customers;