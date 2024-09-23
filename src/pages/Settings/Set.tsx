import { useState } from 'react';
import { UpdateHeroBanner, UpdateMiddleAdvert } from '../../utils/ApiCalls';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";

const Settings = () => {
    const [heroBanner, setHeroBanner] = useState<File | null>(null);
    const [middleAdvert, setMiddleAdvert] = useState<File | null>(null);
    const [previewHeroBanner, setPreviewHeroBanner] = useState<string | null>(null);
    const [previewMiddleAdvert, setPreviewMiddleAdvert] = useState<string | null>(null);
    const [show, setShow] = useState(true);
    const [show2, setShow2] = useState(false);
    const [isLoadingHero, setIsLoadingHero] = useState(false);
    const [isLoadingAdvert, setIsLoadingAdvert] = useState(false);

    const Togglebanner = () => {
        setShow(true);
        setShow2(false);
    };

    const ToggleAdvert = () => {
        setShow2(true);
        setShow(false);
    };

    const { getRootProps: getRootPropsHero, getInputProps: getInputPropsHero } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setHeroBanner(file);
            setPreviewHeroBanner(URL.createObjectURL(file));
        },
        multiple: false,
    });

    const { getRootProps: getRootPropsAdvert, getInputProps: getInputPropsAdvert } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setMiddleAdvert(file);
            setPreviewMiddleAdvert(URL.createObjectURL(file));
        },
        multiple: false,
    });

    const handleHeroBannerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!heroBanner) {
            toast.error("Please select a banner image.");
            return;
        }

        setIsLoadingHero(true);
        const formData = new FormData();
        formData.append('media', heroBanner);

        try {
            const response = await UpdateHeroBanner(formData);
            if (response.status === 201) {
                toast.success("Hero banner updated successfully!");
                setHeroBanner(null);
                setPreviewHeroBanner(null);
            }
        } catch (error) {
            console.error("Error updating hero banner:", error);
            toast.error("Failed to update hero banner.");
        } finally {
            setIsLoadingHero(false);
        }
    };

    const handleMiddleAdvertSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!middleAdvert) {
            toast.error("Please select an advert image.");
            return;
        }

        setIsLoadingAdvert(true); 
        const formData = new FormData();
        formData.append('media', middleAdvert);

        try {
            const response = await UpdateMiddleAdvert(formData);
            if (response.status === 201) {
                toast.success("Middle advert updated successfully!");
                setMiddleAdvert(null);
                setPreviewMiddleAdvert(null);
            }
        } catch (error) {
            console.error("Error updating middle advert:", error);
            toast.error("Failed to update middle advert.");
        } finally {
            setIsLoadingAdvert(false);
        }
    };

    return (
        <div className='w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]'>
            <div className='w-[100%] h-[100%] flex flex-col'>
                <h1 className="text-[20px] font-[600] mb-6">Home Settings</h1>

                <div className='w-[100%] flex items-center h-[50px] border-b border-[#a8a8a8]'>
                    <h1
                        onClick={Togglebanner}
                        className={`text-[16px] font-[600] text-[#0333ae] cursor-pointer ${show ? 'underline underline-offset-4 text-blue-600' : ''}`}
                    >
                        Update Hero Banner
                    </h1>
                    <h1
                        onClick={ToggleAdvert}
                        className={`text-[16px] font-[600] text-[#0333ae] ml-[25px] cursor-pointer ${show2 ? 'underline underline-offset-4 text-blue-600' : ''}`}
                    >
                        Update Home Middle Advert
                    </h1>
                </div>

                {show && (
                    <div className='mt-[20px] w-[100%] flex flex-col'>
                        <div
                            {...getRootPropsHero()}
                            className="h-[180px] border-2 border-dashed border-blue-400 bg-blue-50 p-6 rounded-lg text-center justify-center flex items-center cursor-pointer hover:bg-blue-100 transition-all duration-300"
                        >
                            <input {...getInputPropsHero()} />
                            <p className="text-blue-600">Drag & drop an image here, or click to select a file</p>
                        </div>

                        {previewHeroBanner && (
                            <div className="mt-6">
                                <h3 className="font-medium text-gray-700 mb-2">Preview:</h3>
                                <img
                                    src={previewHeroBanner}
                                    alt="Hero Banner Preview"
                                    className="w-[300px] h-[300px] object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleHeroBannerSubmit}
                            className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg text-lg transition duration-300 ease-in-out shadow-md'
                            disabled={isLoadingHero}
                        >
                            {isLoadingHero ? 'Updating...' : 'Update Hero Banner'}
                        </button>
                    </div>
                )}

                {show2 && (
                    <div className='mt-[20px] w-[100%] flex flex-col'>
                        <div
                            {...getRootPropsAdvert()}
                            className="h-[180px] border-2 border-dashed border-blue-400 bg-blue-50 p-6 rounded-lg text-center justify-center flex items-center cursor-pointer hover:bg-blue-100 transition-all duration-300"
                        >
                            <input {...getInputPropsAdvert()} />
                            <p className="text-blue-600">Drag & drop an image here, or click to select a file</p>
                        </div>

                        {previewMiddleAdvert && (
                            <div className="mt-6">
                                <h3 className="font-medium text-gray-700 mb-2">Preview:</h3>
                                <img
                                    src={previewMiddleAdvert}
                                    alt="Middle Advert Preview"
                                    className="w-[300px] h-[300px] object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleMiddleAdvertSubmit}
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg text-lg transition duration-300 ease-in-out shadow-md"
                            disabled={isLoadingAdvert}
                        >
                            {isLoadingAdvert ? 'Updating...' : 'Update Middle Advert'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
