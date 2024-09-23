import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { GetUsersByType, UpdateUser } from '../../utils/ApiCalls';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    country: string;
    currency: string;
    role: string;
}

const Vendor = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        country: '',
        currency: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState('vendor');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await GetUsersByType(searchType);
                setUsers(response.data.data);
                setFilteredUsers(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [searchType]);

    useEffect(() => {
        const results = users.filter(user =>
            user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.currency.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const openModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            country: user.country,
            currency: user.currency
        });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            try {
                await UpdateUser(selectedUser.id, formData);
                const response = await GetUsersByType(searchType);
                setUsers(response.data.data);
                toast.success('User updated successfully!');
                closeModal();
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Error updating user.');
            }
        } else {
            console.error('No user selected for update');
            toast.error('No user selected for update.');
        }
    };

    const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchType(e.target.value);
        setCurrentPage(0);
    };

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(offset, offset + itemsPerPage);

    return (
        <div className="w-[95%] bg-[#fff] h-[100%] pt-[20px] flex justify-center items-center pb-[30px] mt-[70px]">
            <ToastContainer />
            <div className="w-[100%] flex-col h-[100%] flex">
                <h1 className="text-[20px] font-[600] mb-6">Users</h1>

                <div className="mb-4 flex space-x-4">
                    <select
                        value={searchType}
                        onChange={handleSearchTypeChange}
                        className="border border-gray-300 rounded-md pl-[5px] pr-[5px] py-2 outline-none"
                    >
                        <option value="vendor">Vendor</option>
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`Search ${searchType}s...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>

                <div className="mt-[15px] shadow-sm border rounded-lg overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-6">First Name</th>
                                <th className="py-3 px-6">Last Name</th>
                                <th className="py-3 px-6">Email</th>
                                <th className="py-3 px-6">Phone</th>
                                <th className="py-3 px-6">Country</th>
                                <th className="py-3 px-6">Currency</th>
                                <th className="py-3 px-6">Role</th>
                                <th className="py-3 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user: User) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.firstname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.lastname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.country}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.currency}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                        <td className="text-right px-6 whitespace-nowrap">
                                            <button
                                                onClick={() => openModal(user)}
                                                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        No results found for {searchType}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <ReactModal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Update User"
                        className="relative flex justify-center items-center w-[100%] p-6 rounded-lg z-[70]"
                        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm flex justify-center items-center"
                    >
                        <div className="bg-white w-[40%] h-[500px] overflow-y-scroll p-6 rounded-lg shadow-lg max-w-md">
                            <h2 className="text-xl font-bold mb-4">Update User</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1" htmlFor="firstname">First Name</label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1" htmlFor="lastname">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1" htmlFor="phone">Phone</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1" htmlFor="country">Country</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1" htmlFor="currency">Currency</label>
                                    <input
                                        type="text"
                                        id="currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="ml-4 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </ReactModal>
                </div>

                    <div className="flex justify-center mt-6">
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={Math.ceil(filteredUsers.length / itemsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName="flex space-x-2"
                            pageClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                            previousClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                            nextClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                            breakClassName="border border-gray-300 text-black px-3 py-1 rounded cursor-pointer"
                            activeClassName="bg-blue-500 text-white border-blue-500"
                        />
                    </div>
            </div>
        </div>
    );
};

export default Vendor;
