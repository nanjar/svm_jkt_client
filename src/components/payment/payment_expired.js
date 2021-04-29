import React from "react";
import '../../App.css';

class PaymentExpired extends React.Component {
	render() {
		return (
      		<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12 d-flex flex-column justify-content-center">
								<div className="p-2 align-self-center mb-2">
									<h2 className="text-center display-1">Request Pembayaran expired!</h2>
								</div>
								<div className="p-2 align-self-center"></div>
									<h3 className="text-center display-2">Silahkan dicoba kembali!</h3>
								</div>
							</div>
						</div>
				</div>
			</>
    	);
	}
}

export default PaymentExpired;