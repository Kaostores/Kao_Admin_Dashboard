import React from "react"

interface DateOption{
    label:string;
    value:string;
}
const Last7DaysDropdown:React.FC=()=>{
    const[options,setOptions]=React.useState<DateOption[]>([]);
    const [selectedDate,setSelectedDate]=React.useState<string>("");

    React.useEffect(()=>{
        const currentDate=new Date();
        const dateOptions:DateOption[]=[];

        for(let i=6; i>=0; i--){
            const date=new Date();
            date.setDate(currentDate.getDate() - i);

            const option:DateOption={
                label:formatDate(date),
                value:date.toISOString().split("T")[0]
            };
            dateOptions.push(option)
        }
        setOptions(dateOptions);
        setSelectedDate(dateOptions[0].value);
    },[]);
    const formatDate = (date:Date)=>{
        const options:any={
            weekday:"short",
            year:"numeric",
            month:"short",
            day:"numeric",
        };
        return date.toLocaleDateString("en-US",options)
    };
    const handleDateChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        setSelectedDate(e.target.value)
    }
    return(
        <div>
          <label htmlFor="Last 7 Days:"></label>
          <select name="" id="" value={selectedDate} onChange={handleDateChange} className="outline-0">
            {
                options.map((option)=>(
                    <option key={option.value}>{option.label}</option>
                ))
            }
          </select>
        </div>
    )
}
 export default Last7DaysDropdown;