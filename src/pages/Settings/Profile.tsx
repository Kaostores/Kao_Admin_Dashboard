import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Camera, User } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useProfileImage } from './ProfileImageContext'; // Import context

const Profile = () => {
    const { profileImage, setProfileImage } = useProfileImage(); // Use the context
    const [image, setImage] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null)
        const file = event.target.files?.[0]
        if (file) {
          setIsUploading(true)
          const reader = new FileReader()
          reader.onloadend = () => {
            setImage(reader.result as string)
            setIsUploading(false)
          }
          reader.onerror = () => {
            setError("Failed to read the image file. Please try again.")
            setIsUploading(false)
          }
          reader.readAsDataURL(file)
        }
      }

      const handleSave = () => {
        // Save the image in the context
        setProfileImage(image);
        alert("Profile picture updated successfully!")
      }
    
      const triggerFileInput = () => {
        fileInputRef.current?.click()
      }

  return (
    <div className="w-[100%] h-[100%]  pt-[30px] pb-[30px]">
        <Card className="w-[50%] h-[350px] max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className='text-[17px]'>Change Profile Picture</CardTitle>
        <CardDescription>Upload a new profile picture or avatar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="relative group">
            <Avatar className="w-32 h-32">
              <AvatarImage src={image || profileImage || "/placeholder-user.jpg"} alt="Profile picture" className='object-cover'/>
              <AvatarFallback><User className="w-16 h-16" /></AvatarFallback>
            </Avatar>
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={triggerFileInput}
              role="button"
              aria-label="Change profile picture"
            >
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="picture" className="sr-only">Upload Picture</Label>
          <input 
            id="picture" 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={!image || isUploading} className="w-full bg-[#0333AE] hover:bg-[#0333AE]">
          {isUploading ? "Uploading..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}

export default Profile
