import React, { useState } from "react";
import { PiDotsThreeVertical } from "react-icons/pi";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";
import AgentEdit from "../agents/AgentsEdit";

interface AgentProps {
  id: number;
  name: string;
  add: string;
  order: string;
  pnumb: string;
  lastlogin: string;
}

const AgentSec: React.FC<AgentProps> = ({
  id,
  name,
  add,
  order,
  pnumb,
  lastlogin
}) => {
  const [show, setShow] = useState(false);

  const toggleBtn = () => {
    setShow(!show);
  };

  return (
    <div className="overflow-hidden w-[100%] h-[100%]">
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Phone No
              </th>
              <th scope="col" className="px-6 py-3">
                Last Login
              </th>
              <th scope="col" className="px-6 py-3">
                Active
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="w-4 p-4">{id}</td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {order}
              </th>
              <td className="px-6 py-4">{name}</td>
              <td className="px-6 py-4">{add}</td>
              <td className="px-6 py-4">{pnumb}</td>
              <td className="px-6 py-4">{lastlogin}</td>
              <td className="">
                <div className="px-3 py-2  flex justify-center items-center bg-[#0333ae62] rounded-[5px]">
                  <div className="text-[#0333ae]">Verified</div>
                  <div className="text-[16px] text-[#0333ae]">
                    <PiDotsThreeVertical />
                  </div>
                </div>
              </td>
              <td className="px-[10px]">
                <div className=" flex justify-around items-center border-[1px] border-solid border-[black] rounded-[5px]">
                  <div
                    className="w-[50%] h-[30px] flex justify-center items-center border-r-[1px] border-solid border-[black] text-[#0333ae] cursor-pointer "
                    onClick={toggleBtn}
                  >
                    <IoPersonAddOutline />
                  </div>
                  <div className="w-[50%] h-[100%] flex justify-center items-center text-[#ff0000]">
                    <IoPersonRemoveOutline />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {show && <AgentEdit isOpen={show}
          onClose={() => setShow(false)} />}
      </div>
    </div>
  );
};

export default AgentSec;
