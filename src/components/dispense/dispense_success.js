import React from "react";
import '../../App.css';
import img_down from '../../assets/static_images/down.gif';
import { Row } from 'react-bootstrap';

const DispenseSuccess = () => {
	return (
		<Row className="justify-content-center text-uppercase m-3">
			<div className="p-2 align-self-center mb-3">
				<p className="text-center custom-t1">Pembelian Selesai</p>
			</div>
			<div className="p-2 align-self-center mb-3">
				<p className="text-center custom-t2">Silahkan ambil pembelian anda</p>
			</div>
			<div className="p-2 text-center mb-3">
				<img src={img_down} className="img-thumbnail border-0" alt="Silahkan ambil pembelian anda"></img>
			</div>
			<div className="p-2 align-self-center">
				<p className="text-center custom-t2">Terima Kasih atas pembeliannya!</p>
			</div>
		</Row>
	);
}

export default DispenseSuccess;