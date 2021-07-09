import React from "react";
import '../../App.css';
import { Row } from 'react-bootstrap';

const DispenseError = () => {
	return (
		<Row className="justify-content-center m-3 text-uppercase">
			<div className="p-2 align-self-center">
				{/* an error occurred during purchase, please try again!  */}
				<p className="text-center custom-t1">MAAF, PEMBELIAN TIDAK BERHASIL MOHON DICOBA KEMBALI</p>
			</div>
			<div className="p-2 align-self-center">
				{/* if you have already paid, please report it to the helpline telephone number! */}
				<p className="text-center custom-t1">JIKA SALDO ANDA SUDAH TERPOTONG, HARAP HUBUNGI NOMOR HELPLINE KAMI</p>
			</div>
		</Row>
	);
}

export default DispenseError;