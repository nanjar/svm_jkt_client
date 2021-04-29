import React from "react";
import '../../App.css';

class PaymentCancelled extends React.Component {
	render() {
		return (
     		<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12 d-flex flex-column justify-content-center">
								<div className="p-2 align-self-center mb-2">
									<h1 className="text-center display-1">Pembayaran dibatalkan</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
    	);
	}
}

export default PaymentCancelled;