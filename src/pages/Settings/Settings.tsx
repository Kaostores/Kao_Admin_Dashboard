import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun } from "lucide-react"
import { updatePassword } from "@/utils/ApiCalls";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import Set from "./Set"
import Profile from "./Profile"
import { useGetUserDataQuery } from "@/services/apiSlice";
import Currency from "./Currency"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminSettings() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { data, error, isLoading } = useGetUserDataQuery(undefined);

  useEffect(() => {
    if (data) {
      setEmail(data.data.email);
    }
  }, [data]);

  if (error) {
    console.error("Error fetching user data:", error);
  }
  
  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.success("Passwords do not match");
      return;
    }

    setLoading(true); // Start loading
    try {
      const data = await updatePassword(email, currentPassword, newPassword);

      if (data.success) {
        toast.success("Password updated successfully");
        // Reset the form fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Password update failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const [show1, setShow1] = useState(true)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)

  const Toggle1 = () => {
    setShow1(true)
    setShow2(false)
    setShow3(false)
    setShow4(false)
  }

  const Toggle2 = () => {
    setShow2(true)
    setShow1(false)
    setShow3(false)
    setShow4(false)
  }

  const Toggle3 = () => {
    setShow3(true)
    setShow1(false)
    setShow2(false)
    setShow4(false)
  }

  const Toggle4 = () => {
    setShow4(true)
    setShow3(false)
    setShow2(false)
    setShow1(false)
  }

  return (
    <div className="container mx-auto py-[30px] pt-[90px]">
      <h1 className="text-[20px] font-bold mb-6">Admin Account Settings</h1>
      
      <div className="w-[100%] flex border-b border-[#acacac] mt-[40px]">
        <div className="flex items-center">
          <h3 className={`text-[17px] font-[500] cursor-pointer ${show1 ? ' text-blue-600' : ''}`} onClick={Toggle1}>Update Settings</h3>
          <h3 className={`text-[17px] font-[500] ml-[30px] cursor-pointer ${show2 ? ' text-[#0333AE]' : ''}`} onClick={Toggle2}>Upload Advert</h3>
          <h3 className={`text-[17px] font-[500] ml-[30px] cursor-pointer ${show3 ? ' text-[#0333AE]' : ''}`} onClick={Toggle3}>Update Profile</h3>
          <h3 className={`text-[17px] font-[500] ml-[30px] cursor-pointer ${show4 ? ' text-[#0333AE]' : ''}`} onClick={Toggle4}>Manage Currency</h3>
        </div>
      </div>

      <div className="w-[100%] mt-[30px]">
      {show1 ? (
  <div className="space-y-6">
    {isLoading && (
      <div className="w-[100%] flex justify-between">
        {/* Personal Information Skeleton */}
        <div className="w-[47%]">
          <Skeleton className="h-[280px]" />
        </div>

        {/* Change Password Skeleton */}
        <div className="w-[47%]">
          <Skeleton className="h-[280px]" />
        </div>
      </div>
    )}

    {!isLoading && data && (
      <div className="w-[100%] flex justify-between">
        <div className="w-[47%]">
          <Card className="pb-[80px]">
            <CardHeader>
              <CardTitle className="text-[18px]">Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={`${data.data.firstname} ${data.data.lastname}`}
                  readOnly
                  className="outline-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={data.data.phone}
                  readOnly
                  className="outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-[47%]">
          <Card>
            <CardHeader>
              <CardTitle className="text-[18px]">Change Password</CardTitle>
              <CardDescription>Ensure your account is using a strong password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="flex items-center">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="outline-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="outline-none"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button className="bg-[#0333AE] hover:bg-[#0333AE]" onClick={handlePasswordUpdate}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )}

    {/* Two-Factor Authentication & Notification Preferences */}
    {isLoading && (
      <div className="w-[100%] flex justify-between">
        {/* Two-Factor Authentication Skeleton */}
        <div className="w-[47%]">
          <Skeleton className="h-[180px]" />
        </div>

        {/* Notification Preferences Skeleton */}
        <div className="w-[47%]">
          <Skeleton className="h-[180px]" />
        </div>
      </div>
    )}

    {!isLoading && (
      <div className="w-[100%] flex justify-between">
        <div className="w-[47%]">
          <Card className="pb-[40px]">
            <CardHeader>
              <CardTitle className="text-[18px]">Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-2">
              <Switch id="two-factor" checked={twoFactor} onCheckedChange={setTwoFactor} />
              <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
            </CardContent>
          </Card>
        </div>

        <div className="w-[47%]">
          <Card>
            <CardHeader>
              <CardTitle className="text-[18px]">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="all">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="important" id="important" />
                  <Label htmlFor="important">Important only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">No notifications</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    )}

    {/* Theme */}
    {isLoading && (
      <div className="w-[47%]">
        <Skeleton className="h-[150px]" />
      </div>
    )}

    {!isLoading && (
      <div className="w-[47%]">
        <Card>
          <CardHeader>
            <CardTitle className="text-[18px]">Theme</CardTitle>
            <CardDescription>Select your preferred theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" className="outline-none" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon />
                    <span>Dark</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    )}
  </div>
) : null}


        {show2? (
          <div className="w-[100%] space-y-6">
            <Set />
          </div>
        ) : null}

        {show3? (
          <div>
            <Profile />
          </div>
        ) : null}

        {show4? (
          <div>
            <Currency />
          </div>
        ) : null}
      </div>
    </div>
  )
}