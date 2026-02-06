'use client';

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { BsWallet } from "react-icons/bs";
import { GoChevronDown } from "react-icons/go";
import { PiArrowUpLight } from "react-icons/pi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LineChartOverViewWallet from "@/Charts/WalletChart";
import { getTransactionHistory } from '@/utils/ApiCalls';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetMetricsQuery } from '@/services/apiSlice';
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

  const { data: metricsData } = useGetMetricsQuery({});

  console.log("metrics data for wallet", metricsData)
  console.log("Total Balance:", metricsData?.totalBalance);

  // if (isLoading) {
  //   return <Skeleton className="h-6 w-1/3" />;
  // }

  // if (error) {
  //   return <div className="text-center text-red-500">Failed to load wallet metrics.</div>;
  // }
  

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
    <div className='w-full bg-white min-h-screen pt-4 md:pt-5 pb-8 md:pb-12 px-4 md:px-8'>
      <div className='w-full min-h-full flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 lg:justify-between lg:items-start'>
        <div className='w-full lg:w-2/5 flex flex-col'>
          <div className='w-full bg-white mb-4 md:mb-6 p-4 md:p-6 rounded-lg shadow-lg'>
            <div className='w-full flex flex-col gap-4 md:gap-5'>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-6 w-1/2" />
                </>
              ) : (
                <>
                  <div className='w-full flex justify-between items-start md:items-center flex-col md:flex-row gap-3'>
                    <div className='flex justify-center items-center gap-2'>
                      <div className='text-blue-600 text-base md:text-lg'>
                        <BsWallet />
                      </div>
                      <div className='text-xs md:text-sm font-medium'>Balance</div>
                    </div>
                    <div className='flex justify-center items-center gap-1'>
                      <div className='text-lg md:text-sm text-blue-600 font-medium'>SellowExpress</div>
                      <div className='text-xs md:text-sm text-gray-500'>NGN</div>
                    </div>
                  </div>
                  <div>
                    <div className='text-lg md:text-lg lg:text-2xl font-semibold'>
                      SellowExpress {metricsData?.data?.totalBalance?.toLocaleString() ?? '0.00'}
                    </div>
                  </div>
                  <div className='w-full flex justify-between flex-col sm:flex-row gap-3'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1'>
                        <div className='text-xs md:text-sm'>Profit weekly</div>
                        <div className='text-blue-600 text-sm md:text-base'>
                          <GoChevronDown />
                        </div>
                      </div>
                      <div className='text-green-700 font-semibold text-xs md:text-sm'>
                        SellowExpress 45.000
                      </div>
                    </div>
                    <div className='flex justify-center items-center gap-1'>
                      <div className='text-green-700 text-sm md:text-base'>
                        <PiArrowUpLight />
                      </div>
                      <div className='text-green-700 text-sm md:text-base font-semibold'>3.27%</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='w-full bg-white mb-4 md:mb-6 p-4 md:p-6 rounded-lg shadow-lg min-h-20 md:min-h-24 flex items-center'>
            <div className='w-full flex justify-start items-center'>
              {loading ? (
                <Skeleton className="h-6 w-1/3" />
              ) : (
                <div className='flex justify-center items-center gap-1'>
                  <div className='text-green-700 text-sm md:text-base'>
                    <PiArrowUpLight />
                  </div>
                  <div className='text-green-700 text-sm md:text-base font-semibold'>3.27%</div>
                </div>
              )}
            </div>
          </div>
          <div className='w-full bg-white mb-4 md:mb-6 p-4 md:p-6 rounded-lg shadow-lg flex flex-col gap-3'>
            <div className='w-full flex flex-col gap-2'>
              {loading ? (
                <>
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-40 md:h-48 w-full" />
                </>
              ) : (
                <>
                  <div className='text-xs md:text-sm font-medium'>Income</div>
                  <div className='flex items-center gap-2'>
                    <div className='flex justify-center items-center gap-1'>
                      <div className='text-red-600 text-xs md:text-sm'>
                        <PiArrowUpLight />
                      </div>
                      <div className='text-red-600 text-xs md:text-sm font-semibold'>16.21%</div>
                    </div>
                    <div className='text-xs md:text-sm text-gray-600'>
                      Since last week
                    </div>
                  </div>
                  <div className='w-full h-40 md:h-48 mt-3 md:mt-4 flex justify-start'>
                    <LineChartOverViewWallet />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='w-full lg:w-3/5 bg-white rounded-lg shadow-lg flex flex-col p-4 md:p-6'>
          <div className='w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6'>
            <div className='text-xs md:text-sm font-medium'>Transaction history</div>
            <div className='flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto'>
              <div className='flex-1 sm:flex-none'>
                <Select
                  value={transactionType}
                  onValueChange={(value) => setTransactionType(value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full sm:w-24">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex-1 sm:flex-none'>
                <Select
                  value={timeFrame}
                  onValueChange={(value) => setTimeFrame(value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full sm:w-28">
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
          <div className='w-full max-h-96 md:max-h-[500px] overflow-y-auto'>
            <div className='overflow-x-auto'>
              <Table className='min-w-full'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-xs md:text-sm'>User</TableHead>
                    <TableHead className='text-xs md:text-sm'>ID number</TableHead>
                    <TableHead className='text-xs md:text-sm'>Type</TableHead>
                    <TableHead className='text-xs md:text-sm'>Date</TableHead>
                    <TableHead className='text-xs md:text-sm'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-20 md:w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16 md:w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 md:w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24 md:w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16 md:w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : currentTransactions.length > 0 ? (
                    currentTransactions.map((transaction: Transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className='text-xs md:text-sm'>{`${transaction.user.firstname} ${transaction.user.lastname}`}</TableCell>
                        <TableCell className='text-xs md:text-sm'>0984399</TableCell>
                        <TableCell className='text-xs md:text-sm'>{transaction.type}</TableCell>
                        <TableCell className='text-xs md:text-sm'>{new Date(transaction.date).toLocaleString()}</TableCell>
                        <TableCell className='text-red-600 font-semibold text-xs md:text-sm'>
                          {transaction.amount}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-xs md:text-sm py-8">No transactions found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {!loading && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 md:py-4 mt-3 md:mt-4">
                <div className="text-xs md:text-sm text-muted-foreground">
                  Page {currentPage} of {Math.ceil(filteredTransactions.length / transactionsPerPage)}
                </div>
                <div className="flex gap-1 md:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-xs md:text-sm p-2"
                  >
                    <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredTransactions.length / transactionsPerPage)}
                    className="text-xs md:text-sm p-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
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
