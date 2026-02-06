'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ComplianceDetails from "../compliance/ComplianceDetails";

interface Reply {
    _id: string;
    reply: string;
    createdAt: string;
}

interface Data {
    storeId: string;
    agentId: string;
    category: string;
    name: string;
    agentName: string;
    timeDate: string;
    description: string;
    replies: Reply[];
    id: string;

    complaint: any; // If complaint is a nested object, ensure this type is correctly defined.
}

const Card: React.FC<Data> = ({
    storeId,
    agentId,
    category,
    name,
    agentName,
    timeDate,
    description,
    replies,
    id,
    complaint
}) => {
    const [show, setShow] = React.useState(false);

    const toggleBtn = () => {
        setShow(!show);
    };

    return (
        <div className='w-full sm:w-80 rounded-md flex justify-center items-center bg-[#ddd] mb-4'>
            <div className='w-[96%] flex flex-col py-2 sm:py-3 px-2 sm:px-3'>
                {/* <div className='flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-1 sm:gap-2'>
                    <div className='text-xs sm:text-sm font-bold'>Store id:</div>
                    <div className='text-xs sm:text-sm text-[#0333ae] break-words'>{storeId}</div>
                </div> */}
                {/* <div className='flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-1 sm:gap-2'>
                    <div className='text-xs sm:text-sm font-bold'>Agent id:</div>
                    <div className='text-xs sm:text-sm text-[#0333ae] break-words'>{agentId}</div>
                </div> */}
                <div className='flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-1 sm:gap-2'>
                    <div className='text-xs sm:text-sm font-bold'>Complaint category:</div>
                    <div className='text-xs sm:text-sm text-[#0333ae] break-words'>{category}</div>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-1 sm:gap-2'>
                    <div className='text-xs sm:text-sm font-bold'>Store name:</div>
                    <div className='text-xs sm:text-sm text-[#0333ae] break-words'>{name}</div>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-1 sm:gap-2'>
                    <div className='text-xs sm:text-sm font-bold'>Agent name:</div>
                    <div className='text-xs sm:text-sm text-[#0333ae] break-words'>{agentName}</div>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-5 gap-1 sm:gap-2'>
                    <div className='text-xs sm:text-sm font-bold text-[#818181]'>Time|Date:</div>
                    <div className='text-xs sm:text-sm text-[#818181] break-words'>{timeDate}</div>
                </div>
                <button
                    className='w-full sm:w-32 z-10 cursor-pointer flex justify-center items-center rounded-md py-2 px-3 bg-white border border-[#0000ff] hover:bg-gray-50 transition-colors'
                    onClick={toggleBtn}
                >
                    <div className='text-[#0333ae] text-xs sm:text-sm font-medium'>View more</div>
                </button>
                {show ? (
                    <ComplianceDetails
                        complaint={{ storeId, agentId, category, name, agentName, timeDate, description, replies, id,  complaint }} 
                        isOpen={show}
                        onClose={() => setShow(false)}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default Card;
