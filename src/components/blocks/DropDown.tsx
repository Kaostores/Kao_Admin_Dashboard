import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { setGlobalDate } from "@/services/reducers"

interface DateOption{
    label:string;
    value:string;
}
const Last7DaysDropdown:React.FC=()=>{
    const[options,setOptions]=React.useState<DateOption[]>([]);
    const [selectedDate,setSelectedDate]=React.useState<string>("");
    const dispatch = useDispatch();
    const globalDate = useSelector(
      (state:{persistedReducer:{globalFilters:{globalDate:string}}})=>state.persistedReducer.globalFilters.globalDate
    );

    React.useEffect(()=>{
        const currentDate=new Date();
        const dateOptions:DateOption[]=[{label:"All dates",value:""}];

        for(let i=7; i>=1; i--){
            const date=new Date();
            date.setDate(currentDate.getDate() - i);

            const option:DateOption={
                label:formatDate(date),
                value:date.toISOString().split("T")[0]
            };
            dateOptions.push(option)
        }
        setOptions(dateOptions);
        setSelectedDate(globalDate || "");
        if (!globalDate) {
          dispatch(setGlobalDate(""));
        }
    },[dispatch, globalDate]);
    const formatDate = (date:Date)=>{
        const options = {
            weekday:"short",
            year:"numeric",
            month:"short",
            day:"numeric",
        } as const;
        return date.toLocaleDateString("en-US",options)
    };
    const handleDateChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        const value = e.target.value
        setSelectedDate(value)
        dispatch(setGlobalDate(value))
    }
    return(
        <div>
          <label htmlFor="Last 7 Days:"></label>
          <select name="" id="" value={selectedDate} onChange={handleDateChange} className="outline-0">
            {
                options.map((option)=>(
                    <option key={option.value || option.label} value={option.value}>{option.label}</option>
                ))
            }
          </select>
        </div>
    )
}
 export default Last7DaysDropdown;
