/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react"
import { BsPersonAdd } from "react-icons/bs"
import { PiDotsThreeVertical } from "react-icons/pi"
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { GetUsersByType, GetUserAddress } from "@/utils/ApiCalls"
import AgentDetails from "@/components/agents/AgentsDetails"
import AgentEdit from "@/components/agents/AgentsEdit"
import { format, parseISO } from 'date-fns'
import { useDeleteVendorByIdMutation } from "@/services/apiSlice"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AgentStoresModal from "@/components/agents/AgentStoresModal"

export default function Agents() {
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [popupVisible, setPopupVisible] = useState<string | null>(null)
  const [agentStatus, setAgentStatus] = useState<{ [key: string]: string }>({})
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const agentsPerPage = 5
  const [deleteVendorById] = useDeleteVendorByIdMutation()
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null)
  const [showStoresModal, setShowStoresModal] = useState(false)
  const [storesAgentId, setStoresAgentId] = useState<string | null>(null)
  const globalSearch = useSelector(
    (state:{persistedReducer:{globalFilters:{globalSearch:string}}}) =>
      state.persistedReducer.globalFilters.globalSearch
  )
  const globalDate = useSelector(
    (state:{persistedReducer:{globalFilters:{globalDate:string}}}) =>
      state.persistedReducer.globalFilters.globalDate
  )
  
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, 'MMMM d, yyyy h:mm a')
    } catch {
      return 'Invalid Date'
    }
  }

  const toggleBtn = () => {
    setShow(!show)
    setShow2(false)
  }

  const handleEditAgent = (agent: any) => {
    setSelectedAgent(agent)
    setShow2(true)
    setShow(false)
  }

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await GetUsersByType("agent")
      if (response?.data?.success) {
        setAgents(response.data.data)

        const statusMap: { [key: string]: string } = {}
        response.data.data.forEach((agent: any) => {
          statusMap[agent.id] = "Not Verified"
        })
        setAgentStatus(statusMap)

        const addressPromises = response.data.data.map(async (agent: any) => {
          if (agent.address_uuid) {
            const addressData = await GetUserAddress(agent.address_uuid)
            return { id: agent.id, address: addressData }
          }
          return { id: agent.id, address: "Unknown Address" }
        })

        await Promise.all(addressPromises)
      } else {
        console.error("Failed to fetch agents")
      }
    } catch (error) {
      console.error("Error fetching agents:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const handleDeleteAgent = async (id: string) => {
    try {
      await deleteVendorById(id).unwrap()
      setAgents(agents.filter(agent => agent.id !== id))
      toast.success("Agent deleted successfully")
    } catch (error) {
      console.error("Error deleting Agent:", error)
      toast.error("Failed to delete Agent")
    }
  }

  const confirmDeleteAgent = (id: string) => {
    setAgentToDelete(id)
  }

  const handleCancelDelete = () => {
    setAgentToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!agentToDelete) return
    await handleDeleteAgent(agentToDelete)
    setAgentToDelete(null)
  }

  const handleAgentUpdate = async () => {
    await fetchAgents()
  }

  const handleAgentAdded = () => {
    fetchAgents()
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const headerSearch = globalSearch.trim().toLowerCase()

  const filteredAgents = agents.filter((agent:any)=> {
    const name = `${agent.firstname || ""} ${agent.lastname || ""}`.toLowerCase()
    const email = (agent.email || "").toLowerCase()
    const phone = (agent.phone || "").toLowerCase()
    const country = (agent.country || "").toLowerCase()
    const currency = (agent.currency || "").toLowerCase()

    const matchesSearch =
      !headerSearch ||
      name.includes(headerSearch) ||
      email.includes(headerSearch) ||
      phone.includes(headerSearch) ||
      country.includes(headerSearch) ||
      currency.includes(headerSearch)

    if (!globalDate) {
      return matchesSearch
    }

    if (!agent.last_login) {
      return false
    }
    try {
      const parsed = parseISO(agent.last_login as string)
      const dateStr = parsed.toISOString().split("T")[0]
      const matchesDate = dateStr === globalDate
      return matchesSearch && matchesDate
    } catch {
      return false
    }
  })

  const indexOfLastAgent = currentPage * agentsPerPage
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent)

  return (
    <div className="w-full bg-white px-3 sm:px-5 pt-4 sm:pt-5 pb-8 sm:pb-12 mt-[10px]">
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-1xl sm:text-2xl font-bold">Agents</h1>
          <button 
            onClick={toggleBtn}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[#0333ae] rounded-lg text-[#0333ae] font-semibold hover:bg-[#0333ae] hover:text-white transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <BsPersonAdd className="text-lg" />
            <span className="text-sm">Add agents</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="w-full flex flex-col gap-4 z-0">
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm">Email</TableHead>
                  <TableHead className="text-xs sm:text-sm">Phone no</TableHead>
                  <TableHead className="text-xs sm:text-sm">Country</TableHead>
                  <TableHead className="text-xs sm:text-sm">Currency</TableHead>
                  <TableHead className="text-xs sm:text-sm">Last login</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Stores</TableHead>
                  <TableHead className="text-xs sm:text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: agentsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 8 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  currentAgents.map((agent: any) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{`${agent.firstname} ${agent.lastname}`}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{agent.email || "-"}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{agent.phone || "-"}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{agent.country || "-"}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{agent.currency || "-"}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {agent.last_login ? formatDate(agent.last_login) : "No recent login"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => {
                            setStoresAgentId(agent.id)
                            setShowStoresModal(true)
                          }}
                        >
                          View stores
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-2 rounded-lg text-xs font-medium ${
                            agentStatus[agent.id] === "Verified"
                              ? "bg-green-100 text-green-800"
                              : agentStatus[agent.id] === "Suspended"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {agentStatus[agent.id]}
                          <PiDotsThreeVertical
                            className="ml-2 text-gray-700 cursor-pointer text-base"
                            onClick={() => setPopupVisible(agent.id)}
                          />
                        </div>
                        {popupVisible === agent.id && (
                          <div className="absolute mt-2 w-28 bg-white border border-gray-300 rounded shadow-lg z-50">
                            <div
                              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setAgentStatus((prevStatus) => ({ ...prevStatus, [agent.id]: "Verified" }))
                                setPopupVisible(null)
                              }}
                            >
                              Verify
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 sm:gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent" onClick={() => handleEditAgent(agent)}>
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent" onClick={() => confirmDeleteAgent(agent.id)}>
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {loading ? (
              Array.from({ length: agentsPerPage }).map((_, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : (
              currentAgents.map((agent: any) => (
                <div key={agent.id} className="bg-white border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-semibold text-sm">{`${agent.firstname} ${agent.lastname}`}</div>
                      <div className="text-xs text-gray-600">{agent.phone}</div>
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                        agentStatus[agent.id] === "Verified"
                          ? "bg-green-100 text-green-800"
                          : agentStatus[agent.id] === "Suspended"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {agentStatus[agent.id]}
                      <PiDotsThreeVertical
                        className="ml-1 cursor-pointer text-sm"
                        onClick={() => setPopupVisible(agent.id)}
                      />
                      {popupVisible === agent.id && (
                        <div className="absolute mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg z-50">
                          <div
                            className="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setAgentStatus((prevStatus) => ({ ...prevStatus, [agent.id]: "Verified" }))
                              setPopupVisible(null)
                            }}
                          >
                            Verify
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-700">Address:</span>
                      <div className="truncate">{agent.address || "Unknown Address"}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Country:</span>
                      <div>{agent.country}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Currency:</span>
                      <div>{agent.currency}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Last login:</span>
                      <div className="truncate">
                        {agent.last_login ? formatDate(agent.last_login) : "No recent login"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => handleEditAgent(agent)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => confirmDeleteAgent(agent.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Page {currentPage} of {Math.ceil(agents.length / agentsPerPage)}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs bg-transparent"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs bg-transparent"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(agents.length / agentsPerPage)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {show && <AgentDetails togleBtn={toggleBtn} onAgentAdded={handleAgentAdded} />}
      
      {show2 && selectedAgent && (
        <AgentEdit 
          isOpen={show2}
          onClose={() => setShow2(false)} 
          agent={selectedAgent} 
          onUpdate={handleAgentUpdate} 
        />
      )}

      {agentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-white rounded-lg p-5 shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Are you sure you want to delete this agent?
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              This action cannot be undone. The agent account will be permanently removed from the system.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                No, keep agent
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AgentStoresModal
        isOpen={showStoresModal}
        onClose={() => setShowStoresModal(false)}
        agentId={storesAgentId}
      />
    </div>
  )
}
