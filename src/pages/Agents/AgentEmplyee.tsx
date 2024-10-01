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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

  const handleAgentUpdate = async () => {
    await fetchAgents()
  }

  const handleAgentAdded = () => {
    fetchAgents()
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Calculate pagination values
  const indexOfLastAgent = currentPage * agentsPerPage
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage
  const currentAgents = agents.slice(indexOfFirstAgent, indexOfLastAgent)

  return (
    <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
      <div className="w-[100%] h-[100%] flex items-center flex-col">
        <div className="w-[100%] h-[100px] flex justify-between items-center">
          <div>Agents</div>
          <div className="w-[160px] h-[30px] flex justify-between items-center border-[2px] border-[#0333ae] border-solid rounded-[5px] pr-[8px]">
            <div className="bg-[#0333ae] text-white h-[100%] w-[30px] flex justify-center items-center">
              <BsPersonAdd />
            </div>
            <div className="text-[#0333ae] text-[15px] font-semibold cursor-pointer z-0" onClick={toggleBtn}>
              Add Agents
            </div>
          </div>
        </div>

        <div className="w-[100%] h-[100%] flex justify-center items-center flex-col z-0">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone No</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
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
                      <TableCell className="font-medium">{`${agent.firstname} ${agent.lastname}`}</TableCell>
                      <TableCell>{agent.address || "Unknown Address"}</TableCell>
                      <TableCell>{agent.phone}</TableCell>
                      <TableCell>{agent.country}</TableCell>
                      <TableCell>{agent.currency}</TableCell>
                      <TableCell>
                        {agent.last_login ? formatDate(agent.last_login) : "No recent login"}
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
                            className="ml-2 text-[#3a3a3a] cursor-pointer text-[16px]"
                            onClick={() => setPopupVisible(agent.id)}
                          />
                        </div>
                        {popupVisible === agent.id && (
                          <div className="absolute mt-2 w-[120px] bg-white border border-gray-300 rounded shadow-lg z-50">
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
                      {/* <TableCell>
                        <div className="flex justify-around items-center border-[1px] border-solid border-[black] rounded-[5px]">
                          <div
                            className="w-[50%] h-[30px] flex justify-center items-center border-r-[1px] border-solid border-[black] text-[#0333ae] cursor-pointer"
                            onClick={() => handleEditAgent(agent)}
                          >
                            <IoPersonAddOutline />
                          </div>
                          <div onClick={() => handleDeleteAgent(agent.id)} className="w-[50%] h-[100%] cursor-pointer flex justify-center items-center text-[#ff0000]">
                            <IoPersonRemoveOutline />
                          </div>
                        </div>
                      </TableCell> */}
                      <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="icon" onClick={() => handleEditAgent(agent)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteAgent(agent.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {!loading && (
              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {Math.ceil(agents.length / agentsPerPage)}
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
                  disabled={currentPage === Math.ceil(agents.length / agentsPerPage)}
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

      {show && <AgentDetails togleBtn={toggleBtn} onAgentAdded={handleAgentAdded} />}
      
      {show2 && selectedAgent && (
        <AgentEdit 
          togleBtn2={() => setShow2(false)} 
          agent={selectedAgent} 
          onUpdate={handleAgentUpdate} 
        />
      )}
    </div>
  )
}