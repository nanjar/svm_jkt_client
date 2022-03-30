import React, { useEffect, useState }  from "react";
import { useHistory } from "react-router-dom";
import { Row } from 'react-bootstrap';
import '../../App.css';

const DispenseError = () => {
	const [dispensingTimeout, setDispensingTimeout] = useState(false);
	const history = useHistory();
	setTimeout(function() { history.push("/");  console.log("inTimeout") }, 10000);
	console.log("dispense error 1");
	useEffect(() => {
		console.log("dispense error");
		setDispensingTimeout(setTimeout(function() { history.push("/");  console.log("inTimeout") }, 10000));

		return () => {
			clearTimeout(dispensingTimeout);
			setDispensingTimeout(false);
		}
	});

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