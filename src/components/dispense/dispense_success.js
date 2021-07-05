import React from "react";
import '../../App.css';
import img_down from '../../assets/static_images/down.gif';
import { Row } from 'react-bootstrap';

const DispenseSuccess = () => {
	return (
		<Row className="justify-content-center text-uppercase m-3">
			<div className="p-2 align-self-center mb-3">
				{/* purchase completed */}
				<p className="text-center custom-t0">Pembelian Selesai</p>
			</div>
			<div className="p-2 align-self-center mb-3">
				{/* please take your purchase */}
				<p className="text-center custom-t0">Silahkan ambil pembelian anda</p>
			</div>
			<div className="p-2 text-center mb-3">
				<img src={img_down} className="img-thumbnail border-0" alt="please take your purchase"></img>
			</div>
			<div className="p-2 align-self-center">
				{/* thanks for the purchase! */}
				<p className="text-center custom-t0">Terima Kasih atas pembeliannya!</p>
			</div>
		</Row>
	);
}

export default DispenseSuccess;