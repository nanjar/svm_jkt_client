import React from "react";
import { Link } from "react-router-dom";
import '../../App.css';
// import img_waiting from '../../assets/static_images/waiting.gif'; payment/pay?price={price}&machine_id=1&type=IGRS
import img_waiting from '../../assets/qr/qr_code.png';

class GoPay extends React.Component {
	constructor(props) {
		super(props); 
		this.state = { gopay_data: {} };
	}

	componentDidMount() {

		console.log("price");
		const {
			match: {
				params: { price }
			}
		} = this.props;

		const url = '/payment/pay?price=' + price; 

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				this.setState({ gopay_data: response });
			})
			.catch(() => this.props.history.push("/"));
	}

	render() {
		const { price } = this.state.gopay_data;

		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12">

								<div className="col-7 d-flex flex-column justify-content-center">
									<div className="p-2 align-self-center mb-3">
										<h1 className="text-center display-3">QR code ini aktif selama 00m:00s</h1>
									</div>
									<div className="p-2 align-self-center">
										<img src={img_waiting} className="img-thumbnail border-0" alt="Menunggu..."></img>
									</div>
								</div>

								<div className="col-5 d-flex flex-column justify-content-center">
									<div className="p-2 align-self-center mb-3">
										<h1 className="text-center display-4">Anda telah memilih untuk membayar dengan <strong>{price}</strong> menggunakan</h1>
									</div>
									<div className="p-2 align-self-center">
										<Link to="/payment/cancelled" className="btn btn-lg btn-warning">
											<h2 className="text-center display-4">Batal</h2>
										</Link>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</>
    	);
	}
}

export default GoPay;