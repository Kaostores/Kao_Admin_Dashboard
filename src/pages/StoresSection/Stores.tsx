/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react"
import StoreWithdrawal from "@/components/props/StoreWithdrawal"
import { useViewAllStoresQuery, useApproveStoreMutation, useSuspendStoreMutation, useGetStoreByIdQuery } from "@/services/apiSlice"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pencil, ChevronDown, FileText } from "lucide-react"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import StoreEdit from "@/components/store/EditStore"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux"

interface Store {
  id: string
  name: string
  email: string
  address: string
  phone: string
  LastWithdrawal: string
  category: string
  status: string
  verifiedBy: {
    firstname: string
    lastname: string
  } | null
}

const Store = () => {
  const [show2, setShow2] = useState(true)
  const [show3, setShow3] = useState(false)
  const [selectedStoreUuid, setSelectedStoreUuid] = useState<string | null>(null)
  const [storeList, setStoreList] = useState<Store[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const storesPerPage = 10
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
  const [storeToSuspend, setStoreToSuspend] = useState<string | null>(null)
  const [suspensionNote, setSuspensionNote] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)
  const [selectedStoreForDocs, setSelectedStoreForDocs] = useState<string | null>(null)

  const { data: stores, isLoading, isError, error } = useViewAllStoresQuery({})

  const globalSearch = useSelector(
    (state:{persistedReducer:{globalFilters:{globalSearch:string}}})=>state.persistedReducer.globalFilters.globalSearch
  );
  const globalDate = useSelector(
    (state:{persistedReducer:{globalFilters:{globalDate:string}}})=>state.persistedReducer.globalFilters.globalDate
  );
  const [approveStore] = useApproveStoreMutation()
  const [suspendingStore] = useSuspendStoreMutation()

  const { data: singleStoreData, isLoading: isDocsLoading } = useGetStoreByIdQuery(
    selectedStoreForDocs as string,
    {
      skip: !selectedStoreForDocs || !isDocsModalOpen,
    }
  )

  const cleanUrl = (value?: string | null) =>
    value ? value.replace(/`/g, "").trim() : ""

  useEffect(() => {
    if (stores && stores.data) {
      setStoreList(stores.data)
    }
  }, [stores])

  const toggleBtn2 = () => {
    setShow2(true)
    setShow3(false)
  }

  const toggleBtn3 = () => {
    setShow2(false)
    setShow3(true)
  }

  const handleStatusChange = async (storeUuid: string, newStatus: string) => {
    try {
      if (newStatus === 'verified') {
        const response = await approveStore(storeUuid).unwrap()
        console.log('Store approved response:', response)
      }
    } catch (error: any) {
      console.error(`Error ${newStatus === "verified" ? "approving" : "suspending"} store:`, error.message)
    }

    setStoreList((prevStores) =>
      prevStores.map((store) =>
        store.id === storeUuid ? { ...store, status: newStatus } : store
      )
    )
  }

  const handleSuspend = async () => {
    if (storeToSuspend && suspensionNote.trim()) {
      try {
        const response = await suspendingStore({
          store_uuid: storeToSuspend,
          note: suspensionNote,
        }).unwrap()
        console.log("Store suspended response:", response)
        
        setStoreList((prevStores) =>
          prevStores.map((store) =>
            store.id === storeToSuspend ? { ...store, status: 'suspended' } : store
          )
        )
        setIsSuspendModalOpen(false)
        setSuspensionNote('')
        setStoreToSuspend(null)
      } catch (error) {
        console.error("Error suspending store:", error)
      }
    } else {
      console.error("Suspension note is required")
    }
  }

  const handleEditClick = (storeUuid: string) => {
    setSelectedStoreUuid(storeUuid)
    setIsEditModalOpen(true)
  }

  const handleViewDocsClick = (storeUuid: string) => {
    setSelectedStoreForDocs(storeUuid)
    setIsDocsModalOpen(true)
  }

  const lowerSearch = globalSearch.trim().toLowerCase()

  const filteredStores = storeList.filter((store)=> {
    const matchesSearch =
      !lowerSearch ||
      (store.name || "").toLowerCase().includes(lowerSearch) ||
      (store.email || "").toLowerCase().includes(lowerSearch) ||
      (store.address || "").toLowerCase().includes(lowerSearch) ||
      (store.phone || "").toLowerCase().includes(lowerSearch) ||
      (store.category || "").toLowerCase().includes(lowerSearch) ||
      (store.status || "").toLowerCase().includes(lowerSearch);

    if (!globalDate) {
      return matchesSearch;
    }

    const dateValue = store.LastWithdrawal;
    if (!dateValue) {
      return false;
    }
    const parsed = new Date(dateValue);
    if (isNaN(parsed.getTime())) {
      return false;
    }
    const dateStr = parsed.toISOString().split("T")[0];
    const matchesDate = dateStr === globalDate;

    return matchesSearch && matchesDate;
  });

  const indexOfLastStore = currentPage * storesPerPage
  const indexOfFirstStore = indexOfLastStore - storesPerPage
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isError) {
    console.error("Error loading store details.", error)
    return <div>Error loading store details.</div>
  }

  return (
    <div className="w-[95%] bg-white h-full pt-2 flex justify-center items-center pb-8">
      <div className="w-full h-full flex items-center flex-col">
        <div className="w-full h-[100px] flex justify-start items-center">
          <div className="w-full flex justify-between items-center">
            <div className="w-[210px] h-[30px] flex justify-between items-center border-2 border-[#0333ae] border-solid rounded-md z-0">
              <Button
                variant={show2 ? "default" : "outline"}
                className={`w-[105px] h-full rounded-r-none ${show2 ? "bg-[#0333ae] text-primary-foreground hover:bg-[#0333ae] hover:text-[#fff]" : "bg-[#fff] text-[#0333ae] hover:text-[#0333ae]"}`}
                onClick={toggleBtn2}
              >
                All stores
              </Button>
              <Button
                variant={show3 ? "default" : "outline"}
                className={`w-[105px] h-full rounded-l-none ${show3 ? "bg-[#0333ae] text-primary-foreground hover:bg-[#0333ae] hover:text-[#fff]" : "bg-[#fff] text-[#0333ae] hover:text-[#0333ae]"}`}
                onClick={toggleBtn3}
              >
                Withdrawals
              </Button>
            </div>
          </div>
        </div>

        {show2 && (
          <div className="w-full h-full flex justify-center items-center flex-col">
            <div className="relative overflow-hidden w-full h-full">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Store name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Phone no</TableHead>
                      <TableHead>Last withdrawal</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Agent name</TableHead>
                      <TableHead>Docs</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                        </TableRow>
                      ))
                    ) : currentStores.length > 0 ? (
                      currentStores.map((store) => (
                        <TableRow key={store.id} className="bg-white border-b hover:bg-gray-50">
                          <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.name}</TableCell>
                          <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.email}</TableCell>
                          <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.address}</TableCell>
                          <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.phone}</TableCell>
                          <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.LastWithdrawal}</TableCell>
                          <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>{store.category}</TableCell>
                          <TableCell className={store.status === 'pending' ? 'text-red-500' : ''}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-full justify-between rounded-full ${
                                    store.status === 'approved' ? 'bg-[#0333ae] hover:bg-[#0333ae] hover:text-[#fff] text-white' :
                                    store.status === 'suspended' ? 'bg-red-500 hover:bg-red-500 hover:text-[#fff] text-white' :
                                    store.status === 'pending' ? 'bg-red-300 text-[#fff]' : 'bg-gray-300 text-white'
                                  }`}
                                >
                                  {store.status === 'pending' ? 'Not Verified' : store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                                  <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleStatusChange(store.id, 'verified')}>
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setStoreToSuspend(store.id)
                                  setIsSuspendModalOpen(true)
                                }}>
                                  Suspend
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell>{store.verifiedBy ? `${store.verifiedBy.firstname} ${store.verifiedBy.lastname}` 
    : 'N/A'}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewDocsClick(store.id)}
                              title="View documents"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="icon" onClick={() => handleEditClick(store.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">No stores available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {Math.ceil(storeList.length / storesPerPage)}
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
                    disabled={currentPage === Math.ceil(storeList.length / storesPerPage)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              <Dialog open={isSuspendModalOpen} onOpenChange={setIsSuspendModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="mb-[20px]">Suspend Store</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={suspensionNote}
                    onChange={(e) => setSuspensionNote(e.target.value)}
                    placeholder="Enter suspension note..."
                    className="min-h-[100px] resize-none mb-[20px] outline-none"
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSuspendModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleSuspend}>
                      Suspend
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isDocsModalOpen} onOpenChange={(open) => {
                setIsDocsModalOpen(open)
                if (!open) {
                  setSelectedStoreForDocs(null)
                }
              }}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="mb-[10px]">
                      Store documents
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {isDocsLoading && (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-64 w-full" />
                      </div>
                    )}
                    {!isDocsLoading && singleStoreData?.data && (
                      <div className="space-y-6">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Store:</span>{" "}
                          {singleStoreData.data.name}
                        </p>
                        {[
                          {
                            label: "CAC document",
                            key: "cac_document",
                          },
                          {
                            label: "KYC document",
                            key: "kyc_document",
                          },
                          {
                            label: "Business document",
                            key: "business_document",
                          },
                          {
                            label: "Utility bill",
                            key: "utility_bill",
                          },
                        ].map((doc) => {
                          const rawUrl = (singleStoreData.data as any)[doc.key] as string | null | undefined
                          const url = cleanUrl(rawUrl)

                          if (!url) return null

                          const isPdf = url.toLowerCase().endsWith(".pdf")

                          return (
                            <div key={doc.key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm text-gray-800">
                                  {doc.label}
                                </span>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#0333ae] underline"
                                >
                                  Open in new tab
                                </a>
                              </div>
                              <div className="border rounded-md overflow-hidden bg-gray-50">
                                {isPdf ? (
                                  <iframe
                                    src={url}
                                    className="w-full h-72"
                                    title={doc.label}
                                  />
                                ) : (
                                  <img
                                    src={url}
                                    alt={doc.label}
                                    className="w-full max-h-72 object-contain bg-white"
                                  />
                                )}
                              </div>
                            </div>
                          )
                        })}
                        {!isDocsLoading &&
                          singleStoreData?.data &&
                          !cleanUrl((singleStoreData.data as any).cac_document) &&
                          !cleanUrl((singleStoreData.data as any).kyc_document) &&
                          !cleanUrl((singleStoreData.data as any).business_document) &&
                          !cleanUrl((singleStoreData.data as any).utility_bill) && (
                            <p className="text-sm text-gray-500">
                              No documents uploaded for this store.
                            </p>
                          )}
                  </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {selectedStoreUuid && (
                <StoreEdit
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  storeUuid={selectedStoreUuid}
                  updateStoreInList={(updatedStore: Store) => {
                    const updatedList = storeList.map((store) =>
                      store.id === updatedStore.id ? updatedStore : store
                    )
                    setStoreList(updatedList)
                  }}
                  storeDetails={storeList.find((store) => store.id === selectedStoreUuid)}
                />
              )}
            </div>
          </div>
        )}

        {show3 && (
          <div className="w-full h-full flex justify-center items-center flex-col">
            <StoreWithdrawal
              // name="Jaji Yusuf"
              // agentName="Zoro Romanus"
              // storeId="23546487"
              // amount="400,000"
              // lastWithdraw="11:29 AM 20-02-2024"
              // approve="Approve all"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Store


