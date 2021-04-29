import React from "react";
import '../../App.css';

class PaymentStatusError extends React.Component {
	render() {
		return (
      		<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center mb-3">
											<h1 className="text-center display-3">Request pembayaran tidak dapat dibatalkan karena alasan yang tidak diketahui!</h1>
											<br/>
										</div>
										<div className="p-2 align-self-center mb-3">
											<h1 className="display-4">Maaf atas ketidak nyamanan ini</h1>
										</div>
										<div className="p-2 align-self-center">
											<h1 className="display-4">Jika anda sudah membayar, tolong hubungi helpline kami!</h1>
										</div>
								</div>
							</div>
						</div>
				</div>
			</>
    	);
	}
}

export default PaymentStatusError;