import React, { useContext, useEffect, useState } from "react";
import '../../App.css';
import img_down from '../../assets/static_images/down.gif';
import { Row, Modal } from 'react-bootstrap';
import { SocketContext } from "../../services/socket";
import { useHistory } from "react-router-dom";
import SERVER_REQ  from '../../helpers/Request';
const BUTTON_E = "button_pressed";

const DispenseSuccess = ({dispensingTimeout, setDispensingTimeout = (dispensing) => {}}) => {
	const socket = useContext(SocketContext);
	const history = useHistory();
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
		</Row>
	);
}

export default DispenseSuccess;