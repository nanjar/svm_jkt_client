import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom"
import { SocketContext } from "../../services/socket";
import LoadingImage from '../../assets/static_images/success.gif';
import DispenseSuccess from "./dispense_success";
import DispenseError from "./dispense_error";
const DISPENSE_E = "dispense";

const Dispensing = () => {
    const {slot_id} = useParams();
    const [dispenseResult, setDispenseResult] = useState(4);
    const [isDispensing, setDespensing] = useState(true);
    const socket = useContext(SocketContext);
    useEffect(()=>{
        const slot = parseInt(slot_id)
        socket.emit('vendingv1-indo', {"command":"single_dispense","slot":slot-1,"reply_to": DISPENSE_E});
        let received_dispense = false
        console.log(isDispensing)
        socket.on(DISPENSE_E, (data) => {
            const response = JSON.parse(data);
            if(isDispensing) return;
            // if(received_dispense) return;
            // setDespensing(false);
            // setDispenseResult(0);
            // received_dispense = true
            console.log(response)
        })

        return () => {
            socket.offAny(DISPENSE_E)
        }
    })
    return <div>
        {
                isDispensing 
            ? 
                <>
                    <h1>Payment Success</h1>
                    <h1>Machine is dispesing your product...</h1>
                    <img src={LoadingImage} />
                </>
            :
                dispenseResult === 0 ? <DispenseError /> : <DispenseSuccess />
        }
        
    </div>;
}

export default Dispensing;