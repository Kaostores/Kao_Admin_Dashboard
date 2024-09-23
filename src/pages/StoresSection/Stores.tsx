import React from "react";
import { IoStorefrontOutline } from "react-icons/io5";
import StoresSec from "@/components/store/StoreSec";
import StoreWithdrawal from "@/components/props/StoreWithdrawal";
import { useViewAllStoresQuery } from "@/services/apiSlice";

const Store = () => {
    const [show, setShow] = React.useState(false);
    const [show2, setShow2] = React.useState(true);
    const [show3, setShow3] = React.useState(false);

    const { data: stores, isLoading, isError } = useViewAllStoresQuery({});

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching stores.</div>;

console.log("Fetched stores data:", stores?.data);



    console.log("Fetched stores data:", stores);

    const toggleBtn = () => {
        setShow(!show);
    };

    const toggleBtn2 = () => {
        setShow2(true);
        setShow3(false);
    };

    const toggleBtn3 = () => {
        setShow2(false);
        setShow3(true);
    };


    


    return (
        <div className='w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]'>
            <div className='w-[100%] h-[100%] flex items-center flex-col'>
                <div className="w-[100%] h-[100px] flex justify-start items-center">
                    <div className="w-[100%] flex justify-between items-center">
                        <div className="w-[210px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] z-0">
                            <div className={`w-[105px] h-[100%] flex justify-center items-center cursor-pointer ${show2 ? "bg-[#0333ae] text-white" : "bg-white text-[#0333ae] font-semibold"}`} onClick={toggleBtn2}>
                                All Stores
                            </div>
                            <div className={`w-[105px] h-[100%] flex justify-center items-center cursor-pointer ${show3 ? "bg-[#0333ae] text-white" : "bg-white text-[#0333ae] font-semibold"}`} onClick={toggleBtn3}>
                                Withdrawals
                            </div>
                        </div>
                        {show2 ? (
                            <div className="w-[210px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px]">
                                <div className="w-[30px] h-[100%] flex justify-center items-center"><IoStorefrontOutline /></div>
                                <div className="bg-[#0333ae] w-[180px] text-white h-[100%] flex justify-center items-center text-[15px] cursor-pointer z-0" onClick={toggleBtn}>
                                    ADD STORE
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {show2 ? (
                    <div className="w-[100%] h-[100%] flex justify-center items-center flex-col">
                        <StoresSec 
                            stores={stores?.data || []} 
                            loading={isLoading} 
                            toggleBtn={toggleBtn} 
                        />
                    </div>
                ) : null}

                {show3 ? (
                    <div className="w-[100%] h-[100%] flex justify-center items-center flex-col">
                        <StoreWithdrawal name="Jaji Yusuf" agentName="Zoro Romanus" storeId="23546487" amount='400,000' lastWithdraw="11:29 AM 20-02-2024" approve="Approve all" />
                    </div>
                ) : null}
            </div>

            
        </div>
    );
};

export default Store;
