import React from "react";
import { Row } from 'react-bootstrap';
import '../../App.css';

const DispenseError = () => {
	return (
		<Row className="justify-content-center m-3 text-uppercase">
			<div className="p-3 align-self-center">
				{/* an error occurred during purchase, please try again!  */}
				<p className="text-center custom-t1">MAAF, PEMBELIAN TIDAK BERHASIL <br/> MOHON DICOBA KEMBALI</p>
			</div>
			<div className="p-3 align-self-center">
				{/* if you have already paid, please report it to the helpline telephone number! */}
				<p className="text-center custom-t1">JIKA SALDO ANDA SUDAH TERPOTONG <br/> HARAP HUBUNGI NOMOR HELPLINE KAMI</p>
			</div>
		</Row>
	);
}

export default DispenseError;