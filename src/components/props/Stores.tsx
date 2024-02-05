import React from "react"
import { IoStorefrontOutline} from "react-icons/io5";
import StoreEdit from "../store/EditStore";

interface data{
    name:string,
    add:string,
    order:string,
    pnumb:string,
    lastWithdrawal:string
}


const Stores:React.FC<data>=(
    {name,add,order,pnumb,lastWithdrawal}
    )=>{
        const[show,setShow]=React.useState(false)

        const togleBtn=()=>{
            setShow(!show)
        }

    return (
			<div className='relative overflow-hidden w-[100%] h-[100%]'>
				<div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
					<table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
						<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
							<tr>
								<th scope='col' className='p-4'>
									#
								</th>
								<th scope='col' className='px-6 py-3'>
									Store ID
								</th>
								<th scope='col' className='px-[5px] py-[5px]'>
									Store Name
								</th>
								<th scope='col' className='px-6 py-3'>
									Address
								</th>
								<th scope='col' className='px-6 py-3'>
									Phone No
								</th>
								<th scope='col' className='px-6 py-3'>
									Last Withdrawal
								</th>
								<th scope='col' className='px-6 py-3'>
									Active
								</th>
								<th scope='col' className='px-6 py-3'>
									Agent Name
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
								<td className='w-4 p-4'>1</td>
								<th
									scope='row'
									className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
									{order}
								</th>
								<td className='px-[5px] py-[5px]  min-w-[100px]'>{name}</td>
								<td className='px-6 py-4'>{add}</td>
								<td className='px-6 py-4'>{pnumb}</td>
								<td className='px-6 py-4'>{lastWithdrawal}</td>
								<td className=''>
									<div className='px-3 py-2  flex justify-center items-center bg-[#0333ae62] rounded-[5px]'>
										<div className='text-[#0333ae]'>Verified</div>
									</div>
								</td>
								<td className='px-[10px]'>
									<div className=' flex justify-around items-center'>
										<div className='min-w-[120px] h-[30px] flex justify-center items-center text-[#000]'>
											{name}
										</div>
										<div
											className='text-[20px] h-[100%] flex justify-center items-center text-[#0333ae] cursor-pointer'
											onClick={togleBtn}>
											<IoStorefrontOutline />
										</div>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<nav
						className='flex items-center flex-column w-[65%] flex-wrap md:flex-row justify-between pt-4'
						aria-label='Table navigation'>
						<span className='text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto'>
							Showing{" "}
							<span className='font-semibold text-gray-900 dark:text-white'>
								1-10
							</span>{" "}
							of{" "}
							<span className='font-semibold text-gray-900 dark:text-white'>
								1000
							</span>
						</span>
						<ul className='inline-flex -space-x-px rtl:space-x-reverse gap-2 text-sm h-8'>
							<li>
								<a
									href='#'
									className='flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
									Previous
								</a>
							</li>
							<li>
								<a
									href='#'
									className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
									1
								</a>
							</li>
							<li>
								<a
									href='#'
									className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
									2
								</a>
							</li>
							<li>
								<a
									href='#'
									aria-current='page'
									className='flex items-center justify-center px-3 h-8 text-white border border-gray-300 bg-[#0333ae] hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'>
									3
								</a>
							</li>
							<li>
								<a
									href='#'
									className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
									4
								</a>
							</li>
							<li>
								<a
									href='#'
									className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
									5
								</a>
							</li>
							<li>
								<a
									href='#'
									className='flex items-center justify-center px-3 h-8 leading-tight text-white bg-[#0333ae] border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
									Next
								</a>
							</li>
						</ul>
					</nav>
				</div>
				{show ? (
					<div>
						<StoreEdit togleBtn={togleBtn} />
					</div>
				) : null}
			</div>
		);
}

export default Stores;