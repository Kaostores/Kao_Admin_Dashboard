import { BsWallet } from "react-icons/bs";
import { GoChevronDown } from "react-icons/go";
import { PiArrowUpLight } from "react-icons/pi";
import LineChartOverViewWallet from "@/Charts/WalletChart";
import { useState, useEffect } from 'react';
import { getTransactionHistory } from '@/utils/ApiCalls';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wallet = () => {

	const [transactions, setTransactions] = useState([]);
  	const [loading, setLoading] = useState(true);
  	const [error] = useState(null);

	useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactionHistory();
        setTransactions(data.data); // Adjust this based on the response structure
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

	if (loading) return <div>Loading...</div>;
  	if (error) return <div>{error}</div>;	

	return (
		<div className='w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]'>
			<div className='w-[100%] min-h-[100%] flex justify-between items-start'>
				<div className='w-[40%] h-[100%] flex flex-col justify-center items-center'>
					<div className='w-[100%] h-[200px] bg-white mb-[25px] flex justify-center items-center rounded-[10px] shadow-xl'>
						<div className='w-[95%] h-[92%] flex flex-col justify-between'>
							<div className='w-[100%] flex justify-between items-center'>
								<div className='flex justify-center items-center'>
									<div className='mr-[10px] text-[#0000ff] text-[14px]'>
										<BsWallet />
									</div>
									<div className='text-[13px]'>Balance</div>
								</div>
								<div className='flex justify-center items-center'>
									<div className='text-[14px] text-[#0000ff] mr-[5px]'>KAO</div>
									<div className='text-[14px] text-[#c0bfbf]'>NGN</div>
								</div>
							</div>
							<div>
								<div className='text-[22px] font-semibold'>
									KAO 346,254,000.09
								</div>
							</div>
							<div className='w-[100%] flex justify-between '>
								<div className='flex flex-col'>
									<div className='flex items-center'>
										<div className='text-[11px]'>Profit weekly</div>
										<div className='text-[14px] text-[#0000ff]'>
											<GoChevronDown />
										</div>
									</div>
									<div className='text-[#008348] font-semibold text-[13px]'>
										KAO 45.000
									</div>
								</div>
								<div className='flex justify-center items-center'>
									<div className='text-[#008348] text-[14px]'>
										<PiArrowUpLight />
									</div>
									<div className='text-[#008348] text-[14px]'>3.27%</div>
								</div>
							</div>
						</div>
					</div>
					<div className='w-[100%] h-[80px] bg-white mb-[25px] flex justify-center items-center rounded-[10px] shadow-xl'>
						<div className='w-[94%] flex justify-center items-center'>
							<div className='w-[100%] flex justify-between '>
								<div className='flex flex-col'>
									<div className=''>
										<div className='text-[11px]'>Exchange rate</div>
									</div>
									<div className='text-[#008348] font-semibold text-[13px]'>
										KAO 1.01 - NGN 5.00
									</div>
								</div>
								<div className='flex justify-center items-center'>
									<div className='text-[#008348] text-[14px]'>
										<PiArrowUpLight />
									</div>
									<div className='text-[#008348] text-[14px]'>3.27%</div>
								</div>
							</div>
						</div>
					</div>
					<div className='w-[100%] py-[10px] px-[10px] bg-white mb-[15px] flex justify-center items-center rounded-[10px] shadow-xl'>
						<div className='w-[94%] h-[98%] flex justify-between  flex-col'>
							<div className='text-[13px]'>income</div>
							<div className='flex items-center'>
								<div className='flex justify-center items-center mr-[10px]'>
									<div className='text-[13px] text-[#ff0000]'>
										<PiArrowUpLight />
									</div>
									<div className='text-[13px] text-[#ff0000]'>16.21%</div>
								</div>
								<div className='text-[13px] text-[#666565]'>
									Since last week
								</div>
							</div>
							<div className='w-[100%] h-[200px] mt-[20px] flex justify-start'>
								<LineChartOverViewWallet />
							</div>
						</div>
					</div>
				</div>
				<div className='w-[57%] min-h-[650px]  bg-white rounded-[10px] shadow-xl flex-col p-[10px]'>
					<div className='w-[100%] flex justify-between items-center mb-[20px]'>
						<div className='text-[13px]'>Transaction History</div>
						<div className='flex justify-center items-center'>
							<div className='flex justify-center items-center mr-[10px]'>
								<div className='text-[13px]'></div>
								<div className='text-[15px] '>
									<select
										style={{ backgroundColor: "transparent" }}
										className='b'>
										<option>Both</option>
										<option>Both</option>
										<option>Both</option>
									</select>
								</div>
							</div>
							<div className='flex justify-center items-center'>
								<div className='text-[13px]'>This Year</div>
								<div className='text-[15px] text-[#0000ff]'>
									<GoChevronDown />
								</div>
							</div>
						</div>
					</div>
					<div className='w-[100%] h-[500px] overflow-y-scroll '>
						<table className='h-[600px]  w-[100%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
							<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
								<tr>
									<th className='px-[10px] py-[15px]'>User</th>
									<th className='px-[10px] py-[15px]'>ID Number</th>
									<th className='px-[10px] py-[15px]'>Type</th>
									<th className='px-[10px] py-[15px]'>Date</th>
									<th className='px-[10px] py-[15px]'>Amount</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((transaction: any) => (
									<tr key={transaction.id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
										<td className='px-[6px] py-[3px]'>{`${transaction.user.firstname} ${transaction.user.lastname}`}</td>
									<td className='px-[6px] py-[3px]'>0984399</td>
									<td className='px-[6px] py-[3px]'>{transaction.type}t</td>
									<td className='px-[6px] py-[3px]'>{new Date(transaction.date).toLocaleString()}</td>
									<td className='px-[6px] py-[3px] text-[#ff0000] font-semibold'>
										{transaction.amount}
									</td>
								</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Wallet;
