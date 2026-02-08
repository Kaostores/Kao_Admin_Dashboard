/* eslint-disable @typescript-eslint/no-explicit-any */
import { PiArrowUpLight } from "react-icons/pi";
import { PiArrowDownLight } from "react-icons/pi";

interface Props {
	tit: string;
	Ic: any;
	Cl: any;
	fig: string;
	increment: any;
}

const Card: React.FC<Props> = ({ tit, fig, increment }) => {
	return (
		<div className="flex-1 h-[150px] w-[100%] flex-wrap  rounded-[6px] bg-white flex justify-center items-center px-[10px]
                border border-gray-200 hover:border-gray-300 transition-colors">
  <div className="w-[100%] h-[100%] flex flex-col justify-around">
    <div className="text-[13px] text-gray-500">{tit}</div>

    <div className="text-[20px] font-medium text-gray-900">{fig}</div>

    <div className="w-full flex justify-between items-center">
      <div className="w-[40px] flex justify-center items-center gap-1">
        <div
          className={`text-[7px] sm:text-[13px] ${
            increment >= "3.00%" ? "text-[#44ce4b]" : "text-red-700"
          }`}
        >
          {increment >= "3.00%" ? <PiArrowUpLight /> : <PiArrowDownLight />}
        </div>

        <div
          className={`text-[7px] sm:text-[13px] ${
            increment >= "3.00%" ? "text-[#44ce4b]" : "text-red-700"
          }`}
        >
          {increment}
        </div>
      </div>

      <div className="text-[9px] text-right sm:text-[10px] text-gray-400">
        Since last week
      </div>
    </div>
  </div>
</div>

	);
};
export default Card;
