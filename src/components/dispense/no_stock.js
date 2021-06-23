import React from "react";
import '../../App.css';
import { Row } from 'react-bootstrap';

const NoStock = () => {
	return (
		<Row className="justify-content-center text-uppercase m-3">
			<div className="p-2 align-self-center mb-3">
				<p className="text-center custom-t0">Barang yang ada pilih sedang habis!</p>
			</div>
			<div className="p-2 align-self-center">
				<p className="text-center custom-t0">Silahkan mencoba item lainnya!</p>
			</div>
		</Row>
	);
}

export default NoStock;