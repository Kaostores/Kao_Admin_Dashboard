// import React, { useState } from "react";
// import { GoChevronDown } from 'react-icons/go';
// import { useAddReplyToComplaintMutation } from "@/services/apiSlice"; 
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface Reply {
//     _id: string;
//     reply: string;
//     createdAt: string;
// }

// interface Complaint {
//     storeId: string;
//     agentId: string;
//     category: string;
//     name: string;
//     agentName: string;
//     timeDate: string;
//     description: string;
//     replies: Reply[];
//     id: string;
//     complaint: any
// }

// interface Iprops {
//     complaint: Complaint;
//     toggleBtn: () => void;
// }

// const ComplianceDetails: React.FC<Iprops> = ({ complaint, toggleBtn }) => {
//     const [showReplyInput, setShowReplyInput] = useState(false);
//     const [replyMessage, setReplyMessage] = useState("");
//     const [addReply, { isLoading }] = useAddReplyToComplaintMutation();
//     const [replies, setReplies] = useState<Reply[]>(complaint.replies);

//     console.log("this is the complaint", complaint)

//     const handleSendReply = async () => {
//         if (replyMessage.trim()) {
//             try {
//                 const response = await addReply({ complainID: complaint.complaint.id, message: replyMessage });
//                 console.log(response);
//                 const newReply: Reply = {
//                     _id: response.data._id,
//                     reply: replyMessage,
//                     createdAt: new Date().toISOString(),
//                 };

//                 setReplies((prevReplies) => [...prevReplies, newReply]);
//                 setReplyMessage("");
//                 setShowReplyInput(false);
//                 toast.success("Reply sent")
//             } catch (error: any) {
//                 console.error("Failed to send reply:", error.message);
//                 toast.error("Failed to send reply")
//             }
//         } else {
//             toast.error("Reply message cannot be empty")
//         }
//     };

//     return (
//         <div className='w-screen h-[100vh] z-20 flex justify-center bg-[#ffffff1f] items-center fixed left-0 top-0 backdrop-blur-sm'>
//             <div className='w-[40%] h-[calc(100%-70px)] pl-[20px]  pt-[20px] flex justify-center items-center mt-[70px]'>
//                 <div className='w-[96%] h-[550px] overflow-y-scroll px-5 bg-[#f8f7f7] rounded-[10px] flex justify-center items-center border-[1px] border-solid'>
//                     <div className='w-[97%] h-[96%] flex flex-col'>

//                         <div className='flex flex-col'>
//                             <div className='mb-[15px]'>
//                                 <div className='flex items-center text-[14px]'>
//                                     <div className='flex justify-center items-center mr-[30px]'>
//                                         <div className='font-bold'>Store id:</div>
//                                         <div className='text-[#0333ae] ml-[5px]'>{complaint.storeId}</div>
//                                     </div>
//                                     <div className='flex justify-center items-center'>
//                                         <div className='font-bold'>Store name:</div>
//                                         <div className='text-[#0333ae] ml-[5px]'>{complaint.name}</div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className='mb-[15px]'>
//                                 <div className='flex items-center text-[14px]'>
//                                     <div className='flex justify-center items-center mr-[30px]'>
//                                         <div className='font-bold'>Agent id:</div>
//                                         <div className='text-[#0333ae] ml-[5px]'>{complaint.agentId}</div>
//                                     </div>
//                                     <div className='flex justify-center items-center'>
//                                         <div className='font-bold'>Agent name:</div>
//                                         <div className='text-[#0333ae] ml-[5px]'>{complaint.agentName}</div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className='w-[100%] flex justify-between text-[14px] mb-[20px]'>
//                                 <div className='flex justify-center items-center mr-[30px]'>
//                                     <div className='font-bold'>Complaint category:</div>
//                                     <div className='text-[#0000ff] ml-[5px]'>{complaint.category}</div>
//                                 </div>
//                                 <div className='flex justify-center items-center'>
//                                     <div className='font-bold text-[#797777]'>Time|Date:</div>
//                                     <div className='text-[#797777] ml-[5px]'>{complaint.timeDate}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className='w-[100%] bg-[#ddd] p-[10px] rounded-[5px] border-[1px] border-[#0333ae] border-solid mb-[15px]'>
//                             <div className='text-[13px]'>{complaint.description}</div>
//                         </div>

//                         <div className='w-[100%] mb-[15px]'>
//                             <div className='font-bold mb-[10px] text-[14px]'>Replies</div>
//                             {replies.length > 0 ? (
//                                 <div className='bg-[#f2f2f2] p-[10px] h-[150px] overflow-y-scroll rounded-[5px] border-[1px] border-solid border-[#ccc]'>
//                                     {replies.map((reply) => (
//                                         <div key={reply._id} className='mb-[10px]'>
//                                             <div className='text-[#0333ae] font-semibold text-[13px]'>
//                                                  {new Date(reply.createdAt).toLocaleString()}
//                                             </div>
//                                             <div className='text-[13px]'>{reply.reply}</div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className='text-[13px] text-[#888888]'>No replies yet.</div>
//                             )}
//                         </div>

//                         <div className='w-[100%] mb-[20px]'>
//                             {showReplyInput ? (
//                                 <div className="w-[100%] mb-[20px]">
//                                     <textarea
//                                         value={replyMessage}
//                                         onChange={(e) => setReplyMessage(e.target.value)}
//                                         placeholder="Type your reply here..."
//                                         className="w-full p-2 border border-gray-300 rounded-md resize-none"
//                                         rows={3}
//                                     />
//                                     <button
//                                         onClick={handleSendReply}
//                                         className="mt-2 py-1 px-4 bg-[#0333ae] text-white rounded"
//                                         disabled={isLoading}
//                                     >
//                                         {isLoading ? "Sending..." : "Send reply"}
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <button
//                                     className="mt-2 py-1 px-4 bg-gray-300 text-black rounded"
//                                     onClick={() => setShowReplyInput(true)}
//                                 >
//                                     Send reply
//                                 </button>
//                             )}
//                         </div>

//                         <div className='w-[100%] flex justify-between items-center pb-[20px]'>
//                             <div className='flex justify-center items-center p-[5px] border-[1px] border-[#888787] border-solid rounded-[5px]'>
//                                 <div className='mr-[30px] text-[12px]'>Display action</div>
//                                 <div className='text-[14px] text-[#0333ae] cursor-pointer'>
//                                     <GoChevronDown />
//                                 </div>
//                             </div>
//                             <div className='flex justify-center items-center text-[13px]'>
//                                 <div className='border-[1px] bg-[#0333ae] border-solid rounded-[5px] py-[8px] px-[35px] cursor-pointer' onClick={toggleBtn}>
//                                     <div className='text-[#fff]'>Done</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ComplianceDetails;

'use client'

import React, { useState } from "react";
import { useAddReplyToComplaintMutation } from "@/services/apiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";

interface Reply {
    _id: string;
    reply: string;
    createdAt: string;
}

interface Complaint {
    storeId: string;
    agentId: string;
    category: string;
    name: string;
    agentName: string;
    timeDate: string;
    description: string;
    replies: Reply[];
    id: string;
    complaint: any;
}

interface Iprops {
    complaint: Complaint;
    isOpen: boolean;
    onClose: () => void;
}

const ComplianceDetails: React.FC<Iprops> = ({ complaint, isOpen, onClose }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [addReply, { isLoading }] = useAddReplyToComplaintMutation();
    const [replies, setReplies] = useState<Reply[]>(complaint.replies);

    console.log("this is the complaint", complaint);

    const handleSendReply = async () => {
        if (replyMessage.trim()) {
            try {
                const response = await addReply({ complainID: complaint.complaint.id, message: replyMessage });
                console.log(response);
                const newReply: Reply = {
                    _id: response.data._id,
                    reply: replyMessage,
                    createdAt: new Date().toISOString(),
                };

                setReplies((prevReplies) => [...prevReplies, newReply]);
                setReplyMessage("");
                setShowReplyInput(false);
                toast.success("Reply sent");
            } catch (error: any) {
                console.error("Failed to send reply:", error.message);
                toast.error("Failed to send reply");
            }
        } else {
            toast.error("Reply message cannot be empty");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] h-[600px] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Complaint Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-[30px]">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-bold">Store ID:</span> {complaint.storeId}
                        </div>
                        <div>
                            <span className="font-bold">Store Name:</span> {complaint.name}
                        </div>
                        <div>
                            <span className="font-bold">Agent ID:</span> {complaint.agentId}
                        </div>
                        <div>
                            <span className="font-bold">Agent Name:</span> {complaint.agentName}
                        </div>
                        <div>
                            <span className="font-bold">Complaint Category:</span> {complaint.category}
                        </div>
                        <div>
                            <span className="font-bold">Time|Date:</span> {complaint.timeDate}
                        </div>
                    </div>

                    <div className="bg-muted p-3 rounded-md text-sm">
                        {complaint.description}
                    </div>

                    <div>
                        <h3 className="font-bold mb-2 text-sm">Replies</h3>
                        <ScrollArea className="h-[150px] w-full rounded-md border border-[#0333ae] p-4">
                            {replies.length > 0 ? (
                                replies.map((reply) => (
                                    <div key={reply._id} className="mb-3">
                                        <div className="text-primary font-semibold text-xs">
                                            {new Date(reply.createdAt).toLocaleString()}
                                        </div>
                                        <div className="text-sm">{reply.reply}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground">No replies yet.</div>
                            )}
                        </ScrollArea>
                    </div>

                    {showReplyInput ? (
                        <div className="space-y-2">
                            <Textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your reply here..."
                                rows={3}
                            />
                            <Button className="bg-[#0333ae] hover:bg-[#0333ae]" onClick={handleSendReply} disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send reply"}
                            </Button>
                        </div>
                    ) : (
                        <Button className="bg-[#0333ae] hover:bg-[#0333ae]" onClick={() => setShowReplyInput(true)}>
                            Send reply
                        </Button>
                    )}

                    <div className="flex justify-between items-center">
                        <Button variant="outline" className="text-xs">
                            Display action <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button className="bg-[#0333ae] hover:bg-[#0333ae]" onClick={onClose}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ComplianceDetails;