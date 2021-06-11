import React from "react";
// import ActionCable from 'actioncable';
// import { Link } from "react-router-dom";
import '../../App.css';
import btn_gopay from '../../assets/static_images/gopay.png';
import product_img from '../../assets/static_images/cola.jpg';

class Sale extends React.Component {
	_isMounted = false;
	_intervalId = 0;
	_timerId = 0;

	constructor(props) {
		super(props); 
		this.state = { 
			sale_data: {},
			qrCodeURL: btn_gopay,
			transactionId: "",
			titleMsg: "",
			contentMsg: "",
			statusChanged: "initial",
			redirectURL: "/",
			checkQrStatus: false,
			retry: 0,
			countdown: 121,
			cancelBtnClicked: false,
			showCancel: false // flag for cancel button of popup box
		}

		this.requestQrCode = this.requestQrCode.bind(this);
		this.warningTimeOut = this.warningTimeOut.bind(this);
		this.handleInitialStateChanges = this.handleInitialStateChanges.bind(this);
		this.handleButtonOk = this.handleButtonOk.bind(this);
		this.cancelAtTimeOut = this.cancelAtTimeOut.bind(this);
		this.checkPaymentStatus = this.checkPaymentStatus.bind(this);
		this.handleTimeout = this.handleTimeout.bind(this);
		this.handleCancelPayment = this.handleCancelPayment.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		this.handleInitialStateChanges();
	}

	requestQrCode() {
		const url = 'http://vending.smartvending.com/api/sales/payment.json';
		const amount = 1;
		const product_id = 1;

		const params = new FormData();
		params.set('amount', amount);
		params.set('product_id', product_id);

		fetch(url, {
			method: 'POST',
			body: params
		})
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				console.log("Not ok statusChanged - " + this.state.statusChanged);
				if (this.state.retry < 4) {
					if (this.state.statusChanged === "initial") {
						if (this._isMounted) {
							this.setState({
								titleMsg: "Connection timed out",
								contentMsg: "Cannot connect to payment server. Please try again!",
								statusChanged: "timeout"
							});
							this._intervalId = setInterval(() => { this.handleTimeout(); this._intervalId = 0; }, 5000); // set auto timeout and redirect back to home page after 5 seconds if user doesn't close the popup
						}
						
						if (document.getElementById("open-modal") !== null) {
							document.getElementById("open-modal").click();
						}
					}
				} else {
					// invoke handleInitialStateChanges to request QR code again
					if (this._isMounted) {
						this._intervalId = setInterval(() => { this.handleInitialStateChanges(); this._intervalId = 0; }, 5000);
					}
				} 
			}
		})
		.then(response => { 
			if (response.transaction_status === "pending") {
				const qr = response.actions.find( a => a.name === "generate-qr-code" );
				if (this._isMounted) {
					this.setState({
						qrCodeURL: qr.url,
						transactionId: response.transaction_id,
						checkQrStatus: true,
						intervalId: setInterval(() => {
							let countdown = this.state.countdown;
							if(this.state.countdown === 0){
								countdown = 121
								this.warningTimeOut();
							} else {
								countdown -= 1;
								console.log("countdown - " + countdown);
							}
							this.setState({ countdown: countdown });
						}, 1000)
					});
					this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, 1000);
				}
			} else if (response.status_code === "406") {
				console.log("Status code - " + response.status_code);
				if (this._isMounted) {
					this.setState({
						titleMsg: "Cannot Connect to Server",
						contentMsg: "Please try again!",
						statusChanged: "qrerror"
					});
					this._intervalId = setInterval(() => { this.handleTimeout(); this._intervalId = 0; }, 5000);
				}
				if (document.getElementById("open-modal") !== null) {
					document.getElementById("open-modal").click();
				}
			}
		})
		.catch(error => console.log(error.message));
	}

	warningTimeOut() {
		if (this._isMounted) {
			this.setState({
				titleMsg: "Payment Expiry Warning",
				contentMsg: "Your payment is going to expire soon. Click OK if you still need time to pay.",
				statusChanged: "warned",
				showCancel: true
			});
			this._intervalId = setInterval(() => { this.cancelAtTimeOut(); this._intervalId = 0 }, 60000);
		}
		if (document.getElementById("open-modal") !== null) {
			document.getElementById("open-modal").click();
		}
	}

	handleInitialStateChanges() {
		if (this.state.checkQrStatus) {
			if (this.state.statusChanged === "initial") {
				if (this._isMounted) {
					this.setState({
						titleMsg: "Connection timed out",
						contentMsg: "Your payment connection is timed out. Please try again!",
						statusChanged: "timeout"
					});
					this._intervalId = setInterval(() => { this.handleTimeout(); this._intervalId = 0; }, 5000); // set auto timeout and redirect back to home page after 5 seconds if user doesn't close the popup
				}
				
				if (document.getElementById("open-modal") !== null) {
					document.getElementById("open-modal").click();
				}
			} else if (this.state.statusChanged === "timeout") {
				this.handleTimeout();
			}
		} else {
			if (this._isMounted) {
				this.setState({ retry: this.state.retry + 1});
			}
			this.requestQrCode();
		}
	}

	handleButtonOk(event) {
		const statusChanged = this.state.statusChanged;
		if (document.getElementById("close-modal") !== null) {
			document.getElementById("close-modal").click();
		}
		if (statusChanged === "warned") {
			if (this._isMounted) {
				this._intervalId = setInterval(() => { this.cancelAtTimeOut(); this._intervalId = 0; }, 60000); // wait 1 extra min for payment before invoke cancel even
			}
		} else if (statusChanged === "timeout" || statusChanged === "qrerror") {
			this.handleTimeout();
		} 
		console.log("Btn Status - " + statusChanged);
	}

	cancelAtTimeOut() {
		const url = 'http://vending.smartvending.com/api/sales/cancel.json';
		const transaction_id = this.state.transactionId;

		const params = new FormData();
		params.set('transaction_id', transaction_id);

		fetch(url, {
			method: 'POST',
			body: params
		})
		.then(response => {
			if (response.ok) {
				return response.json();
			} 
		})
		.then(response => { 
			console.log("Transaction Status - " + response.transaction_status);
			console.log("Transaction Status Code - " + response.status_code);
			if (response.transaction_status === "cancel" || response.status_code === "412") { // successful cancel transaction and transaction_status="cancel"
				if (this.state.cancelBtnClicked) {
					this.handleTimeout();
				} else {
					if (this._isMounted) {
						this.setState({
							titleMsg: "Payment Expired",
							contentMsg: "Please try again",
							statusChanged: "timeout",
							showCancel: false
						});
					}
					this._intervalId = setInterval(() => { this.handleTimeout(); this._intervalId = 0; }, 5000); // set auto timeout and redirect back to home page after 5 seconds if user doesn't close the popup

					if (document.getElementById("open-modal") !== null) {
						document.getElementById("open-modal").click();
					}
				}
			}
		})
		.catch(error => console.log(error.message));
	} 

	checkPaymentStatus() {
		const url = 'http://vending.smartvending.com/api/sales/status';
		const transaction_id = this.state.transactionId;

		if(this.state.countdown === 0){
			// process when the countdown end;
			return;
		}

		fetch(url + '?transaction_id=' + transaction_id)
		.then(response => {
			if (response.ok) {
				return response.json();
			} 
		})
		.then(response => { 
			console.log("Transaction status - " + response.transaction_status);
			if (response.transaction_status === "settlement") {
				this.props.history.push("/sale_success"); // Change after confirm what to response
			} else {
				if (this._isMounted) {
					this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, 1000);
				}
			}
		})
		.catch(error => {
			console.log(error.message)
			if (this._isMounted) {
				this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, 1000);
			}
		});
	}

	// Redirect back to Home Page and clear all the timers and intervals
	handleTimeout() {
		if (document.getElementById("close-modal") !== null) {
			document.getElementById("close-modal").click();
		}
		this.props.history.push(this.state.redirectURL);
	}

	handleCancelPayment() {
		if (this._isMounted) {
			this.setState({ 
				cancelBtnClicked: true, 
				showCancel: false 
			});
		}
		this.cancelAtTimeOut();
	}

	componentWillUnmount() {
    this._isMounted = false;
		if (this._timerId) { clearTimeout(this._timerId); this._timerId = 0; }
		if (this._intervalId) { clearInterval(this._intervalId); this.intervalId = 0; }
		this.setState = (state, callback) => {
			return;
		};
  }

	render() {
		const qrCodeURL = this.state.qrCodeURL;
		const titleMsg = this.state.titleMsg;
		const contentMsg = this.state.contentMsg;

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

									<div className="p-2 align-self-center mt-3">
										<button type="button" className="btn btn-primary btn-lg btn-info" onClick={this.handleCancelPayment}>
											<h2 className="text-center text-uppercase custom-t2">Cancel Payment</h2>
										</button>
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
												<button type="button" style={{display: this.state.showCancel ? 'block' : 'none' }} onClick={this.handleCancelPayment} className="btn btn-lg btn-warning text-uppercase font-weight-bold " data-dismiss="modal">
													<h2 className="text-center text-uppercase custom-t2">Cancel</h2>
												</button>
											</div>

											<div className="text-center">
												<button type="button" onClick={this.handleButtonOk} className="btn btn-lg btn-info text-uppercase font-weight-bold ">
													<h2 className="text-center text-uppercase custom-t2">Ok</h2>
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