import React from "react";
import '../../App.css';
import img_payment_success from '../../assets/static_images/success.gif';
import { Row } from 'react-bootstrap';

const Success = () => {
	return (
		<Row className="justify-content-center m-3 text-uppercase">
			<div className="p-2 align-self-center mb-3">
				<p className="text-center custom-t0">Pembayaran anda telah berhasil!</p>
			</div>
			<div className="p-2 align-self-center mb-3">
				<p className="text-center custom-t0">Mengambil barang anda!</p>
			</div>
			<div className="p-2 text-center">
				<img src={img_payment_success} className="img-thumbnail border-0" alt="Pembayaran anda telah berhasil!"></img>
			</div>
		</Row>
	);
}

export default Success;