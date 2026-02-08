import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Data {
  name: string
  storeId: string
  lastWithdraw: string
  agentName: string
  amount: string
  approve: string
}

interface Props {
  data?: Data[] // optional for conditional rendering
}

const StoreWithdrawal: React.FC<Props> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Handle empty or undefined data
  const safeData = data && data.length > 0 ? data : []
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = safeData.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="w-full bg-white px-3 sm:px-5 pt-4 sm:pt-5 pb-8 sm:pb-12 mt-[10px]">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-1xl sm:text-2xl font-bold">Store Withdrawals</h1>
        </div>

        {/* Conditional Rendering */}
        {safeData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No withdrawals available
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block w-full overflow-x-auto rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">#</TableHead>
                    <TableHead className="text-xs sm:text-sm">Store ID</TableHead>
                    <TableHead className="text-xs sm:text-sm">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Last Withdrawal</TableHead>
                    <TableHead className="text-xs sm:text-sm">Agent Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((item, index) => (
                    <TableRow
                      key={item.storeId}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <TableCell className="p-4">{index + 1}</TableCell>
                      <TableCell className="px-6 py-4 font-medium">{item.storeId}</TableCell>
                      <TableCell className="px-6 py-4">{item.name}</TableCell>
                      <TableCell className="px-6 py-4">{item.lastWithdraw}</TableCell>
                      <TableCell className="px-6 py-4">{item.agentName}</TableCell>
                      <TableCell className="px-6 py-4">{item.amount}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="bg-[#0333ae] text-white text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 text-center rounded">
                          {item.approve}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden flex flex-col gap-3">
              {currentData.map((item) => (
                <div
                  key={item.storeId}
                  className="bg-white border rounded-lg p-4 space-y-3 border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="bg-[#0333ae] text-white text-xs px-2 py-1 rounded">{item.approve}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-700">Store ID:</span> {item.storeId}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Agent Name:</span> {item.agentName}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Last Withdrawal:</span> {item.lastWithdraw}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Amount:</span> {item.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
              <div className="text-xs sm:text-sm text-gray-500">
                Page {currentPage} of {Math.ceil(safeData.length / itemsPerPage)}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(safeData.length / itemsPerPage)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StoreWithdrawal
