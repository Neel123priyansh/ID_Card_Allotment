import { useEffect,useState } from "react";
import StudentForm from "./Studentform";

export default function Dashboard()
{
    const [epc,setEpc] = useState("");
    useEffect(()=>
    {
        const ws = new WebSocket("ws://localhost:5000");
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