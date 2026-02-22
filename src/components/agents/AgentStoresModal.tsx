import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { GetStoresReferredByAgent } from "@/utils/ApiCalls"

interface AgentStoresModalProps {
  isOpen: boolean
  onClose: () => void
  agentId: string | null
}

interface ReferredStore {
  id: string
  firstname: string
  lastname: string
  email: string
  phone: string
  country: string
  currency: string
  status: string
}

const AgentStoresModal: React.FC<AgentStoresModalProps> = ({ isOpen, onClose, agentId }) => {
  const [stores, setStores] = useState<ReferredStore[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStores = async () => {
      if (!agentId || !isOpen) {
        return
      }
      setLoading(true)
      setError(null)
      try {
        const response = await GetStoresReferredByAgent(agentId)
        if (response?.success && Array.isArray(response.data)) {
          setStores(response.data)
        } else {
          setStores([])
        }
      } catch (err) {
        setError("Failed to load stores for this agent")
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [agentId, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Agent stores</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="mb-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="w-full overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 5 }).map((__, cellIdx) => (
                      <TableCell key={cellIdx}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : stores.length > 0 ? (
                stores.map((store) => (
                  <TableRow key={store?.id}>
                    <TableCell>{store?.firstname + " " + store?.lastname}</TableCell>
                    <TableCell>{store?.email}</TableCell>
                    <TableCell>{store?.phone}</TableCell>
                    <TableCell>{store?.country}</TableCell>
                    <TableCell>{store?.currency}</TableCell>
                    <TableCell className="capitalize">{store.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm py-4">
                    No stores found for this agent
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AgentStoresModal

