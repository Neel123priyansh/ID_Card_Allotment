import { useEffect,useState } from "react";
import StudentForm from "./Studentform";

export default function Dashboard()
{
    const [epc,setEpc] = useState("");
    useEffect(()=>
    {
        const ws = new WebSocket("ws://id-card-allotment-backend.onrender.com");
        ws.onmessage = event=> {
            const data = JSON.parse(event.data);
            setEpc(data.epc);
        };

        return() => ws.close();

    },[]);

    return(
        <div>
            <StudentForm epc={epc}/>

        </div>
    );
}