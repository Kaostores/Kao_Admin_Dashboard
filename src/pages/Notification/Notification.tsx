'use client'

import { useGetNotificationsQuery } from "@/services/apiSlice"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Notification {
  userId: string
  activity_type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  createdAt: string
  updatedAt: string
  id: string
}

const Notification = () => {
  const { data: notificationsData = { data: [] }, isLoading } = useGetNotificationsQuery({})
  const notifications = notificationsData.data
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleNotificationClick = (notification: Notification) => {
    console.log("Clicked notification:", notification)
  }

  return (
    <div className="container mx-auto px-4 pt-[120px]">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-[20px] font-bold mb-6">Notifications</h1>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification: Notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-colors ${notification.is_read ? 'bg-gray-50' : 'bg-white'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-[18px]">
                  <Bell className="mr-2 h-5 w-5 text-blue-500" />
                  {notification.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{notification.message}</p>
                <p className="text-sm text-gray-400">
                  {format(new Date(notification.created_at), 'PPpp')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No notifications to display.</p>
      )}
    </div>
  )
}

export default Notification;