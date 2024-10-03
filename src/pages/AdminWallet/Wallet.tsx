import { useState, useEffect } from 'react';
import { BsWallet } from "react-icons/bs";
import { GoChevronDown } from "react-icons/go";
import { PiArrowUpLight } from "react-icons/pi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LineChartOverViewWallet from "@/Charts/WalletChart";
import { getTransactionHistory } from '@/utils/ApiCalls';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: string;
  date: string;
  amount: number;
  user: {
    firstname: string;
    lastname: string;
  };
}

const Wallet = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState("both");
  const [timeFrame, setTimeFrame] = useState("this_year");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactionHistory();
        const formattedData: Transaction[] = data.data.map((item: any) => ({
          id: item.id,
          type: item.type,
          date: item.date,
          amount: item.amount,
          user: {
            firstname: item.user.firstname,
            lastname: item.user.lastname
          }
        }));
        setTransactions(formattedData);
        setFilteredTransactions(formattedData);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch transactions');
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactionType, timeFrame, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (transactionType !== "both") {
      filtered = filtered.filter(t => t.type.toLowerCase() === transactionType);
    }

    const currentYear = new Date().getFullYear();
    switch (timeFrame) {
      case "this_year":
        filtered = filtered.filter(t => new Date(t.date).getFullYear() === currentYear);
        break;
      case "last_year":
        filtered = filtered.filter(t => new Date(t.date).getFullYear() === currentYear - 1);
        break;
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className='w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]'>
      <div className='w-[100%] min-h-[100%] flex justify-between items-start'>
        <div className='w-[40%] h-[100%] flex flex-col justify-center items-center'>
          <div className='w-[100%] h-[200px] bg-white mb-[25px] flex justify-center items-center rounded-[10px] shadow-xl'>
            <div className='w-[95%] h-[92%] flex flex-col justify-between'>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-6 w-1/2" />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
          <div className='w-[100%] h-[80px] bg-white mb-[25px] flex justify-center items-center rounded-[10px] shadow-xl'>
            <div className='w-[94%] flex justify-center items-center'>
              {loading ? (
                <Skeleton className="h-6 w-1/3" />
              ) : (
                <div className='w-[100%] flex justify-between '>
                  <div className='flex justify-center items-center'>
                    <div className='text-[#008348] text-[14px]'>
                      <PiArrowUpLight />
                    </div>
                    <div className='text-[#008348] text-[14px]'>3.27%</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='w-[100%] py-[10px] px-[10px] bg-white mb-[15px] flex justify-center items-center rounded-[10px] shadow-xl'>
            <div className='w-[94%] h-[98%] flex justify-between  flex-col'>
              {loading ? (
                <>
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-[200px] w-full" />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
        <div className='w-[57%] min-h-[650px] bg-white rounded-[10px] shadow-xl flex-col p-[10px]'>
          <div className='w-[100%] flex justify-between items-center mb-[20px]'>
            <div className='text-[13px]'>Transaction history</div>
            <div className='flex justify-center items-center'>
              <div className='flex justify-center items-center mr-[10px]'>
                <Select
                  value={transactionType}
                  onValueChange={(value) => setTransactionType(value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex justify-center items-center'>
                <Select
                  value={timeFrame}
                  onValueChange={(value) => setTimeFrame(value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Time frame" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this_year">This year</SelectItem>
                    <SelectItem value="last_year">Last year</SelectItem>
                    <SelectItem value="all_time">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className='w-[100%] h-[500px] overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>ID number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    </TableRow>
                  ))
                ) : currentTransactions.length > 0 ? (
                  currentTransactions.map((transaction: Transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{`${transaction.user.firstname} ${transaction.user.lastname}`}</TableCell>
                      <TableCell>0984399</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                      <TableCell className='text-[#ff0000] font-semibold'>
                        {transaction.amount}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No transactions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {!loading && (
              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {Math.ceil(filteredTransactions.length / transactionsPerPage)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredTransactions.length / transactionsPerPage)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;