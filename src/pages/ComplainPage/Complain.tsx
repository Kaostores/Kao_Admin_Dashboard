import { useEffect, useState } from 'react';
import Card from "@/components/props/ComplainCard";
import { GetComplaints } from '@/utils/ApiCalls';

const Complain = () => {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await GetComplaints();
                if (response?.data) {
                    console.log("This is the complaint response", response);
                    setComplaints(response.data);
                } else {
                    setComplaints([]);
                }
            } catch (error) {
                console.error("Error fetching complaints:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]'>
            <div className='w-[100%] flex justify-between items-center flex-wrap'>
                {complaints.length > 0 ? (
                    complaints.map((complaint: any) => (
                        <Card
                        key={complaint.id}
                        storeId={complaint.store?.id || 'N/A'}
                        agentId={complaint.user?.id || 'N/A'}
                        category={complaint.category || 'N/A'}
                        name={`${complaint.user?.firstname || 'N/A'} ${complaint.user?.lastname || 'N/A'}`}
                        agentName={complaint.user?.firstname || 'N/A'} 
                        timeDate={new Date(complaint.createdAt).toLocaleString()}
                        description={complaint.message || 'No description available'}
                        replies={complaint.replies || []}
                        id={complaint.id || 'N/A'} 
                        complaint={complaint}
                    />
                    ))
                ) : (
                    <div>No complaints available</div>
                )}
            </div>
        </div>
    );
};

export default Complain;
