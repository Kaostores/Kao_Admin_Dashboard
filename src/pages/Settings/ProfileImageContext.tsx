import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface ProfileImageContextType {
    profileImage: string | null;
    setProfileImage: (image: string | null) => void;
}

// Create context with a default value of `null` for profileImage and a no-op function for setProfileImage
const ProfileImageContext = createContext<ProfileImageContextType | undefined>(undefined);

// Create provider component
export const ProfileImageProvider = ({ children }: { children: ReactNode }) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);

    return (
        <ProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
            {children}
        </ProfileImageContext.Provider>
    );
};

// Custom hook for using the context
export const useProfileImage = () => {
    const context = useContext(ProfileImageContext);

    // If the context is undefined, that means the component is being used outside the provider
    if (!context) {
        throw new Error("useProfileImage must be used within a ProfileImageProvider");
    }

    return context;
};
