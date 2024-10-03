import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateSpotlight, GetStoresByStatus } from '@/utils/ApiCalls';

const AddSpotlight = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [store, setStore] = useState('');
    const [stores, setStores] = useState([]);
    const [banner, setBanner] = useState<File | null>(null);
    const [previewBanner, setPreviewBanner] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        // accept: { 'image/*': [] },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setBanner(file);
            setPreviewBanner(URL.createObjectURL(file));
        },
        multiple: false,
    });

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await GetStoresByStatus('pending');
                if (response.success) {
                    setStores(response.data);
                }
            } catch (error) {
                console.error('Error fetching stores:', error);
                toast.error('Failed to fetch stores');
            }
        };

        fetchStores();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) {
        toast.error('Please select a banner image.');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('store', `66e22a62deff4051defb941b`);
    formData.append('image', banner); // Verify this field name matches what the backend expects

    try {
        setLoading(true);
        const response = await CreateSpotlight(formData);
        if (response?.data?.success) {
            toast.success('Spotlight added successfully!');
            setTitle('');
            setDescription('');
            setStore('');
            setBanner(null);
            setPreviewBanner(null);
        }
    } catch (error) {
        toast.error('Failed to add spotlight. Please try again.');
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="w-[95%] bg-white h-[100%] pt-[20px] flexitems-center pb-[30px] mt-[30px]">
            <div className="w-[55%] flex-col h-[100%] flex">
                <div className="w-full bg-white p-8 mt-10 rounded-lg">
                    <h1 className="text-[20px] font-[600] mb-6">Add spotlight</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="border border-gray-300 p-2 w-full rounded outline-none"
                                placeholder="Enter spotlight title"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="border border-gray-300 p-2 w-full rounded outline-none resize-none"
                                placeholder="Enter spotlight description"
                                rows={3}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Select store</label>
                            <select
                                value={store}
                                onChange={(e) => setStore(e.target.value)}
                                // required
                                className="border border-gray-300 p-2 w-full rounded outline-none"
                            >
                                <option value="">Select a store</option>
                                {stores.map((store: any) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Banner</label>
                            <div
                                {...getRootProps()}
                                className="h-[180px] border-2 border-dashed bg-blue-50 p-6 rounded-lg text-center justify-center flex items-center cursor-pointer hover:bg-blue-100 transition-all duration-300"
                            >
                                <input {...getInputProps()} />
                                <p className="">Drag and drop an image here, or click to select a file</p>
                            </div>

                            {previewBanner && (
                                <div className="mt-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Preview:</h3>
                                    <img
                                        src={previewBanner}
                                        alt="Banner Preview"
                                        className="w-[300px] h-[300px] object-cover rounded-lg shadow-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#0333AE] text-white px-4 py-2 rounded hover:bg-[#0333AE] transition duration-200"
                            >
                                {loading ? 'Adding...' : 'Add spotlight'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSpotlight;
