import React from "react";
import '../../App.css';
import img_payment_success from '../../assets/static_images/success.gif';

class Success extends React.Component {
	render() {
		return (
      		<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center mb-3">
											<h1 className="text-center display-2">Pembayaran anda telah berhasil!</h1>
										</div>
										<div className="p-2 align-self-center mb-3">
											<h1 className="text-center display-3">Mengambil barang anda!</h1>
										</div>
										<div className="p-2 align-self-center">
											<img src={img_payment_success} className="img-thumbnail border-0" alt="Pembayaran anda telah berhasil!"></img>
										</div>
								</div>
							</div>
						</div>
				</div>
			</>
    	);
	}
}

export default Success;