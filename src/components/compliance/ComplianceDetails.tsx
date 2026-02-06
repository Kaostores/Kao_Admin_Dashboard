'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
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
            <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Complaint Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4 sm:mt-[30px]">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                    {/* <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:w-1/2">
                        <span className="font-bold text-primary">Store ID:</span>
                        <span className="break-words">{complaint.storeId}</span>
                    </div> */}

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:w-1/2">
                        <span className="font-bold text-primary">Store Name:</span>
                        <span className="break-words">{complaint.name}</span>
                    </div>

                    {/* <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:w-1/2">
                        <span className="font-bold text-primary">Agent ID:</span>
                        <span className="break-words">{complaint.agentId}</span>
                    </div> */}

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:w-1/2">
                        <span className="font-bold text-primary">Agent Name:</span>
                        <span className="break-words">{complaint.agentName}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:w-1/2">
                        <span className="font-bold text-primary">Complaint Category:</span>
                        <span className="break-words">{complaint.category}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:w-1/2">
                        <span className="font-bold text-primary">Time | Date:</span>
                        <span className="break-words">{complaint.timeDate}</span>
                    </div>
                </div>


                    <div className="bg-muted p-3 sm:p-4 rounded-md text-xs sm:text-sm break-words">
                        {complaint.description}
                    </div>

                    <div>
                        <h3 className="font-bold mb-2 text-sm sm:text-base">Replies</h3>
                        <ScrollArea className="h-32 sm:h-[150px] w-full rounded-md border border-[#0333ae] p-3 sm:p-4">
                            {replies.length > 0 ? (
                                replies.map((reply) => (
                                    <div key={reply._id} className="mb-3 pr-4">
                                        <div className="text-primary font-semibold text-xs">
                                            {new Date(reply.createdAt).toLocaleString()}
                                        </div>
                                        <div className="text-xs sm:text-sm break-words">{reply.reply}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs sm:text-sm text-muted-foreground">No replies yet.</div>
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
                                className="text-xs sm:text-sm"
                            />
                            <Button className="w-full sm:w-auto bg-[#0333ae] hover:bg-[#0333ae] text-xs sm:text-sm" onClick={handleSendReply} disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send reply"}
                            </Button>
                        </div>
                    ) : (
                        <Button className="w-full sm:w-auto bg-[#0333ae] hover:bg-[#0333ae] text-xs sm:text-sm" onClick={() => setShowReplyInput(true)}>
                            Send reply
                        </Button>
                    )}

                    <div className="flex justify-between items-center pt-2">
                        <Button variant="outline" className="text-xs sm:text-sm w-full sm:w-auto bg-transparent">
                            Display action <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button className="w-full sm:w-auto bg-[#0333ae] hover:bg-[#0333ae] text-xs sm:text-sm" onClick={onClose}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ComplianceDetails;
