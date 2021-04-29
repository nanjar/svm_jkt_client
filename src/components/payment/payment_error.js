import React from "react";
import '../../App.css';
import img_payment_error from '../../assets/static_images/payment_error.jpeg';

class PaymentError extends React.Component {
	render() {
		return (
      		<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center mb-3">
											<h1 className="text-center display-3">[Payment Type] servis pembayaran tidak dapat dihubungi</h1>
										</div>
										<div className="p-2 align-self-center mb-3">
											<h1 className="text-center display-4">Silahkan mencoba kembali atau cobalah menggunakan metode pembayaran lainnya!</h1>
										</div>
										<div className="p-4 align-self-center">
											<img src={img_payment_error} className="img-thumbnail border-0" alt="Pembayaran tidak berhasil!"></img>
										</div>
								</div>
							</div>
						</div>
				</div>
			</>
    	);
	}
}

export default PaymentError;