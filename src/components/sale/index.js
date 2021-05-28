import React from "react";
// import ActionCable from 'actioncable';
import { Link } from "react-router-dom";
import '../../App.css';
import btn_gopay from '../../assets/static_images/gopay.png';
import product_img from '../../assets/static_images/cola.jpg';

class Sale extends React.Component {
	constructor(props) {
		super(props); 
		this.state = { 
			sale_data: {},
			qrCodeURL: btn_gopay,
			transactionId: "",
			timer: null,
			interval: null,
			titleMsg: "",
			contentMsg: "",
			btnStatus: "",
		}

		this.handleButtonOk = this.handleButtonOk.bind(this);
	}

	componentDidMount() {
		const url = 'http://vending.smartvending.com/api/sales/payment.json';
		const amount = 10;
		const product_id = 1;

		const params = new FormData();
		params.set('amount', amount);
		params.set('product_id', product_id);

		fetch(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'default',
			body: params
		})
		.then(response => {
			if (response.ok) {
				return response.json();
			} 
		})
		.then(response => { 
			console.log(response);
			if (response.transaction_status === "pending") {
				const qr = response.actions.find( a => a.name === "generate-qr-code" );
				this.setState({
					qrCodeURL: qr.url,
					transactionId: response.transaction_id
				});

				this.state.timer = setTimeout(() => this.warningTimeOut(), 5000);
			}
		})
		.catch(error => console.log(error.message));

		// this.state.interval = setInterval(() => this.checkPaymentStatus(), 1000);
	}

	warningTimeOut() {
		this.setState({
			titleMsg: "Payment Expiry Warning",
			contentMsg: "Your payment is going to expire soon. Click OK if you still need time to pay.",
			btnStatus: "warned"
		});
		console.log("Timer " + this.state.timer);
		document.getElementById("open-modal").click();
	}

	handleButtonOk(event) {
		let chkStatus = event.target.getAttribute("data-status");
		console.log(this);
		if (chkStatus === "warned") {
			clearTimeout(this.state.timer);
			this.state.timer = setTimeout(() => this.cancelAtTimeOut(), 2000);
		}
		console.log(chkStatus);
		document.getElementById("close-modal").click();
	}

	cancelAtTimeOut() {
		const url = 'http://vending.smartvending.com/api/sales/cancel.json';
		const transaction_id = this.state.transactionId;

		const params = new FormData();
		params.set('transaction_id', transaction_id);

		fetch(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'default',
			body: params
		})
		.then(response => {
			if (response.ok) {
				return response.json();
			} 
		})
		.then(response => { 
			console.log(response);
			if (response.transaction_status === "cancel") {
				this.setState({
					titleMsg: "Payment Expired",
					contentMsg: "Please try again"
				});
				document.getElementById("open-modal").click();
			}
		})
		.catch(error => console.log(error.message));
	} 

	checkPaymentStatus() {
		const url = 'http://vending.smartvending.com/api/sales/status';
		const transaction_id = this.state.transactionId;

		fetch(url + '?transaction_id=' + transaction_id)
		.then(response => {
			if (response.ok) {
				return response.json();
			} 
		})
		.then(response => { 
			console.log(response);
			if (response.transaction_status === "settlement") {
				this.props.history.push("/sale_success");
			} 
			else if (response.transaction_status === "failure" || response.transaction_status === "deny") {
				document.getElementById("open-modal").click();
			}
		})
		.catch(error => console.log(error.message));
	}

	componentWillUnmount() {
    clearTimeout(this.state.timer);
    clearInterval(this.state.interval);
  }

	render() {
		const qrCodeURL = this.state.qrCodeURL;
		const titleMsg = this.state.titleMsg;
		const contentMsg = this.state.contentMsg;
		const btnStatus = this.state.btnStatus;

		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12">

								<div className="col-5">
									<h1 className="text-center display-3 mb-3">Kamu telah memilih</h1><br/>
									<h1 className="text-center custom-t1">{}</h1>
									<img src={product_img} className="img-thumbnail custom-thumbnail border-0 d-block mx-auto" alt="product" />
									<h1 className="text-center mt-3 custom-t1"><strong>{3500}</strong></h1>
								</div>

								<div className="col-7 d-flex flex-column justify-content-center">
									<div className="p-2 align-self-center mb-3">
										<h1 className="text-center display-3">Silahkan pilih metoda pembayaran</h1>
									</div>
									<div className="p-2 align-self-center m-3">
										<img src={qrCodeURL} className="img-fluid" alt="TEKAN TOMBOL UNTUK MEMULAI"></img>
									</div>
								</div>

							</div>
							
							<button id="open-modal" type="button" className="d-none"  data-toggle="modal" data-target="#myModal" data-dismiss="modal" aria-label="Close">Hidden Button</button>

							<div id="myModal" className="modal text-uppercase" tabIndex="-1" role="dialog">
								<div className="modal-dialog modal-xl modal-en" role="document">
									<div className="modal-content">

										<div className="modal-header bg-warning">
											<h4 className="modal-title display-3">{titleMsg}</h4>
											<button id="close-modal" type="button" className="close custom-t1" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>

										<div className="modal-body">
											<div className="row col-12">
												<h4 className="modal-title display-4">{contentMsg}</h4>
											</div>
										</div>

										<div className="modal-footer p-2">
											<div className="text-center">
												<button type="button" data-status={btnStatus} onClick={this.handleButtonOk} className="btn btn-lg btn-warning text-uppercase font-weight-bold ">
													<h2 data-status={btnStatus} className="text-center text-uppercase custom-t2">Ok</h2>
												</button>
											</div>
										</div>

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

export default Sale;