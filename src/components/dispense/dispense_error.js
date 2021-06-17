import React from "react";
import '../../App.css';
import { Row } from 'react-bootstrap';

const DispenseError = () => {
	return (
		<Row className="justify-content-center m-3 text-uppercase">
			<div className="p-2 align-self-center">
				<p className="text-center custom-t1">Error terjadi saat pembelian, Silahkan dicoba kembali!</p>
			</div>
			<div className="p-2 align-self-center">
			<p className="text-center custom-t1">Jika anda sudah membayar, tolong dilaporkan ke nomor telefon helpline!</p>
			</div>
		</Row>
	);
}

export default DispenseError;