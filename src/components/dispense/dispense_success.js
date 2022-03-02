import React, { useContext, useEffect, useState } from "react";
import '../../App.css';
import img_down from '../../assets/static_images/down.gif';
import { Row, Modal } from 'react-bootstrap';
import { SocketContext } from "../../services/socket";
import { useHistory } from "react-router-dom";
import SERVER_REQ  from '../../helpers/Request';
const BUTTON_E = "button_pressed";

const DispenseSuccess = () => {
	const socket = useContext(SocketContext);
	const history = useHistory();
	const [showAlert, setShowAlert] = useState(false);
	const activate_button = () => {
		socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 50, reply_to: BUTTON_E });
	}
	useEffect(() => {
		var button_pressed = false;
		if(socket){
			// socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 50, reply_to: BUTTON_E });
			activate_button();
			const button_event = async (data) => {
				socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: BUTTON_E });
				data = JSON.parse(data);
				// console.log(data);
				if(button_pressed)
					return;
				button_pressed = true;
				if (button_pressed) { setShowAlert(false); } // close EmptyStockModal at the button pressed
				const button = data.button_no
				if(button === 0 )
					return;
				// console.log('pressed')
				const button_req = await SERVER_REQ.get(`/api/buttons/${button}.json`);
				// console.log(button_req);
				const button_response = button_req.response
				// console.log("button response", button_response);
				if(!button_response.success){
					button_pressed=false;
					setShowAlert(true); // out of stock alert
					setTimeout(function(){ setShowAlert(false); console.log("inTimeout") }, 5000);
					setTimeout( () => activate_button(), 500);
					return;
				}
				const button_detail = button_req.response.data;
				
				const product_detail = {name: button_detail.product.name, url: button_detail.product.image_url, slots: button_detail.slot_available}
				console.log("Product Details", product_detail);
				const url_params = new URLSearchParams(product_detail);
				// console.log(button_detail, `/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`);
				history.push(`/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`)
			}
			socket.off(BUTTON_E, button_event).on(BUTTON_E, button_event);
		}
		return () => {
			socket.off(BUTTON_E);
			socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: BUTTON_E });
		}
	},[])
	return (
		<Row className="justify-content-center text-uppercase mt-5 mb-3">
			<br/><br/><br/>
			<div className="align-self-center">
				{/* purchase completed */}
				<p className="text-center custom-t1">Pembelian Selesai</p>
			</div>
			<div className="align-self-center">
				{/* please take your purchase */}
				<p className="text-center custom-t1">Silahkan ambil pembelian anda</p>
			</div>
			<div className="p-2 text-center">
				<img src={img_down} className="border-0" alt="please take your purchase"></img>
			</div>
			<div className="p-2 align-self-center">
				{/* thanks for the purchase! */}
				<p className="text-center custom-t1">TERIMA KASIH, SELAMAT MENIKMATI!</p>
			</div>
			<Modal show={showAlert} size="lg" centered>
				<Modal.Body>
					<Row className="w-100 justify-content-center text-center">
						<p className="text-uppsercase custom-t2">MAAF STOK TIDAK TERSEDIA</p>
					</Row>
				</Modal.Body>
				{/* <Modal.Footer className="justify-content-center text-center">
					<Button variant="info" onClick={handleButtonOk} className="text-uppercase custom-t2">OK</Button>
				</Modal.Footer> */}
			</Modal>
		</Row>
	);
}

export default DispenseSuccess;