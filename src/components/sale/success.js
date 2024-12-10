import React from "react";
import '../../App.css';
import img_payment_success from '../../assets/static_images/success.gif';
import { Row } from 'react-bootstrap';

const Success = () => {
	return (<div className="vw-100 vh-100 d-flex align-items-center background-Img">
		<Row className="justify-content-center m-3 text-uppercase">
			<div className="p-2 align-self-center mb-3">
				{/* your payment is successful */}
				<p className="text-center custom-t0 sale-success-text-1-600">PEMBAYARAN ANDA TELAH BERHASIL!</p>
			</div>
			<div className="p-1 align-self-center mb-3">
				{/* take your goods */}
				<p className="text-center custom-t0 sale-success-text-2-600">MENGAMBIL BARANG ANDA!</p>
			</div>
			<div className="p-2 text-center">
				<img src={img_payment_success} className="img-thumbnail border-0 sale-success-thumbnail" alt="payment success!"></img>
			</div>
		</Row>
	</div>);
}

export default Success;