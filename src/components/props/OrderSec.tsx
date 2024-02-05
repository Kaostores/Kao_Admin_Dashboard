interface data {
	amount: string;
	storeId: string;
	orderId: string;
	customerId: string;
	timeDate: string;
	paymentMethod: string;
}

const Orders: React.FC<data> = ({
	amount,
	storeId,
	orderId,
	customerId,
	timeDate,
	paymentMethod,
}) => {
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
								Order ID
							</th>
							<th scope='col' className='px-[5px] py-[5px]'>
								Store ID
							</th>
							<th scope='col' className='px-6 py-3'>
								Customer ID
							</th>
							<th scope='col' className='px-6 py-3'>
								Time/Date
							</th>
							<th scope='col' className='px-6 py-3'>
								Amount
							</th>
							<th scope='col' className='px-6 py-3'>
								Payment Method
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
							<td className='w-4 p-4'>1</td>
							<th
								scope='row'
								className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
								{orderId}
							</th>
							<td className='px-[5px] py-[5px]  min-w-[100px]'>{storeId}</td>
							<td className='px-6 py-4'>{customerId}</td>
							<td className='px-6 py-4'>{timeDate}</td>
							<td className='px-6 py-4'>{amount}</td>
							<td className='px-6 py-4'>{paymentMethod}</td>
						</tr>
						<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
							<td className='w-4 p-4'>1</td>
							<th
								scope='row'
								className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
								{orderId}
							</th>
							<td className='px-[5px] py-[5px]  min-w-[100px]'>{storeId}</td>
							<td className='px-6 py-4'>{customerId}</td>
							<td className='px-6 py-4'>{timeDate}</td>
							<td className='px-6 py-4'>{amount}</td>
							<td className='px-6 py-4'>{paymentMethod}</td>
						</tr>
						<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
							<td className='w-4 p-4'>1</td>
							<th
								scope='row'
								className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
								{orderId}
							</th>
							<td className='px-[5px] py-[5px]  min-w-[100px]'>{storeId}</td>
							<td className='px-6 py-4'>{customerId}</td>
							<td className='px-6 py-4'>{timeDate}</td>
							<td className='px-6 py-4'>{amount}</td>
							<td className='px-6 py-4'>{paymentMethod}</td>
						</tr>
						<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
							<td className='w-4 p-4'>1</td>
							<th
								scope='row'
								className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
								{orderId}
							</th>
							<td className='px-[5px] py-[5px]  min-w-[100px]'>{storeId}</td>
							<td className='px-6 py-4'>{customerId}</td>
							<td className='px-6 py-4'>{timeDate}</td>
							<td className='px-6 py-4'>{amount}</td>
							<td className='px-6 py-4'>{paymentMethod}</td>
						</tr>
						<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
							<td className='w-4 p-4'>1</td>
							<th
								scope='row'
								className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
								{orderId}
							</th>
							<td className='px-[5px] py-[5px]  min-w-[100px]'>{storeId}</td>
							<td className='px-6 py-4'>{customerId}</td>
							<td className='px-6 py-4'>{timeDate}</td>
							<td className='px-6 py-4'>{amount}</td>
							<td className='px-6 py-4'>{paymentMethod}</td>
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
		</div>
	);
};

export default Orders;
