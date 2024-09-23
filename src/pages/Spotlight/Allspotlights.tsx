import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { GetAllPosters, UpdatePosterInfo, UpdatePosterImage, DeletePoster } from '@/utils/ApiCalls';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Poster {
    id: string;
    title: string;
    description: string;
    store?: { name: string };
    image: string;
}

const AllSpotlights = () => {
    const [posters, setPosters] = useState<Poster[]>([]);
    const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [banner, setBanner] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null); // Preview state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchPosters = async () => {
            try {
                const { data } = await GetAllPosters();
                if (data.success) {
                    setPosters(data.data);
                } else {
                    setError('Failed to load posters.');
                }
            } catch (error) {
                setError('An error occurred while fetching posters.');
                toast.error('Failed to fetch posters.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosters();
    }, []);

    const handlePosterUpdate = async () => {
        if (selectedPoster) {
            try {
                const body = { title, description };
                await UpdatePosterInfo(selectedPoster.id, body);

                setPosters(
                    posters.map((p: Poster) =>
                        p.id === selectedPoster.id ? { ...p, title, description } : p
                    )
                );
                toast.success('Poster updated successfully.');
                closeModal(); // Close the modal after successful update
            } catch (error) {
                toast.error('Failed to update poster info.');
            }
        }
    };

    const handleBannerUpdate = async () => {
        if (selectedPoster && banner) {
            const formData = new FormData();
            formData.append('image', banner);

            try {
                await UpdatePosterImage(selectedPoster.id, formData);
                toast.success('Poster banner updated successfully.');

                // Update the poster's image in state
                setPosters(
                    posters.map((p: Poster) =>
                        p.id === selectedPoster.id
                            ? { ...p, image: URL.createObjectURL(banner) } // Update with new image URL
                            : p
                    )
                );

                // Close the modal and reset states
                closeModal();
            } catch (error) {
                toast.error('Failed to update poster banner.');
            }
        }
    };

    const handlePosterDelete = async (posterId: string) => {
        try {
            await DeletePoster(posterId);
            setPosters(posters.filter((p: Poster) => p.id !== posterId));
            toast.success('Poster deleted successfully.');
        } catch (error) {
            toast.error('Failed to delete poster.');
        }
    };

    const openModal = (poster: Poster) => {
        setSelectedPoster(poster);
        setTitle(poster.title);
        setDescription(poster.description);
        setBanner(null); // Clear previous banner file
        setBannerPreview(poster.image); // Set the current image as preview
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPoster(null);
        setTitle('');
        setDescription('');
        setBanner(null);
        setBannerPreview(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBanner(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    if (loading) {
        return <div>Loading posters...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="w-[95%] bg-white h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <div className="w-[100%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">All Spotlights</h1>

                <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
                    {posters.length > 0 ? (
                        <table className="w-full table-auto text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="py-3 px-6">Title</th>
                                    <th className="py-3 px-6">Description</th>
                                    <th className="py-3 px-6">Store</th>
                                    <th className="py-3 px-6">Banner</th>
                                    <th className="py-3 px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">
                                {posters.map((poster: Poster) => (
                                    <tr key={poster.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{poster.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{poster.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{poster.store?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={poster.image} alt={poster.title} className="w-20 h-20 object-cover" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => openModal(poster)} className="text-blue-500 mr-2">
                                                Edit
                                            </button>
                                            <button onClick={() => handlePosterDelete(poster.id)} className="text-red-500">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No posters found.</div>
                    )}
                </div>

                {/* Modal */}
                <ReactModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Edit Poster"
                    className="relative h-[500px] overflow-y-scroll bg-white p-6 rounded-lg shadow-lg z-[70] top-0"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
                >
                    <h2 className="text-lg font-semibold mb-4">Edit Poster</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Update Banner:</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="border rounded p-2 w-full"
                        />
                        {bannerPreview && (
                            <div className="mt-4">
                                <img
                                    src={bannerPreview}
                                    alt="Preview"
                                    className="w-40 h-40 object-cover border rounded"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handlePosterUpdate}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Update Info
                        </button>
                        <button
                            onClick={handleBannerUpdate}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Update Banner
                        </button>
                        <button
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </ReactModal>
            </div>
        </div>
    );
};

export default AllSpotlights;
