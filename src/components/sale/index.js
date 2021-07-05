import React from "react";
import SERVER_REQ from '../../helpers/Request';
import FORMATTER from '../../helpers/Formatter';
import '../../App.css';
import logoImage from '../../assets/static_images/loading_qr.gif';
import { Modal, Container, Row, Col } from 'react-bootstrap';

class Sale extends React.Component {
	_isMounted = false;
	_timerId = 0;

	constructor(props) {
		super(props); 
		this.state = { 
			sale_data: {},
			qrCodeURL: logoImage,
			transactionId: "",
			titleMsg: "",
			contentMsg: "",
			statusChanged: "initial",
			redirectURL: "/",
			checkQrStatus: false,
			retry: 0,
			countdown: 121,
			cancelBtnClicked: false,
			product:{id: '', name: '', url: '', price: 1},
			showCancel: false, // modal's cancel button flag
			loadingQR: true,
			showModal: false,
			imgWidth: "80vh",
			imgHeight: "50vh",
			intervalId: false
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
		const {params} = this.props.match;
		const {search} = this.props.location;
		const urlParams = new URLSearchParams(search);
		console.log(urlParams)
		this.setState({ product: {
			name: urlParams.get('name'),
			price: params.amount,
			id: params.product_id,
			url: urlParams.get('url')
		} }, () => {
			this._isMounted = true;
			this.handleInitialStateChanges();
		})
	}

	requestQrCode = async() => {
		const {product, retry} = this.state;
		const reqQrCode = await SERVER_REQ.post(`/api/sales/payment.json`, {'amount': product.price, 'product_id': product.id});
		
		console.log(reqQrCode);

		if (!reqQrCode.response) {
			if (retry < 4) {
				if (this.state.statusChanged === "initial") {
					if (this._isMounted) {
						this.setState({
							titleMsg: "WAKTU KONEKSI HABIS", // connection timeout
							contentMsg: "TIDAK DAPAT TERHUBUNG KE SERVER, SILAKAN COBA LAGI!", // cannot connect to payment server. please try again
							statusChanged: "timeout",
							showModal: true
						});
						// set timeout to redirect home page after 10 seconds
						this._timerId = setTimeout(() => { this.handleTimeout(); this._timerId = 0; }, 10000); 
					}
				}
			} else {
				// invoke handleInitialStateChanges to request QR code every 5 seconds while retry flag is less than 4
				if (this._isMounted) {
					this._timerId = setTimeout(() => { this.handleInitialStateChanges(); this._timerId = 0; }, 5000);
				}
			} 
		} else {
			if (reqQrCode.response.transaction_status === "pending") {
				const qr = reqQrCode.response.actions.find( a => a.name === "generate-qr-code" );
				if (this._isMounted) {
					this.setState({
						qrCodeURL: qr.url,
						imgWidth: "60vh",
						imgHeight: "60vh",
						transactionId: reqQrCode.response.transaction_id,
						checkQrStatus: true,
						intervalId: setInterval(() => {
							let countdown = this.state.countdown;
							if(this.state.countdown === 0){
								countdown = 121
								clearInterval(this.state.intervalId)
								this.warningTimeOut();
							} else {
								countdown -= 1;
								console.log("countdown - " + countdown);
							}
							this.setState({ countdown: countdown });
						}, 1000)
					}, () => {
						this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, 1000);
					});
				}
			} else if (reqQrCode.response.status_code === "400" || reqQrCode.response.status_code === "401" || reqQrCode.response.status_code === "402" || reqQrCode.response.status_code === "406" || reqQrCode.response.status_code === "410") { 
				// possible error codes for payment is 400, 401, 402, 406, and 410
				console.log("Status code - " + reqQrCode.response.status_code);
				if (this._isMounted) {
					this.setState({
						titleMsg: "TIDAK DAPAT TERHUBUNG KE SERVER", // cannot connect to server
						contentMsg: "SILAKAN COBA LAGI!", // please try again
						statusChanged: "qrerror",
						showModal: true
					});

					// set timeout to redirect home page after 10 seconds
					this._timerId = setTimeout(() => { this.handleTimeout(); this._timerId = 0; }, 10000); 
				}
			}
		}
	}

	warningTimeOut = () => {
		if (this._isMounted) {
			this.setState({
				titleMsg: "PERINGATAN KEDALUWARSA PEMBAYARAN", // payment expiry warning
				contentMsg: "PEMBAYARAN ANDA AKAN SEGERA KEDALUWARSA. KLIK “OK” JIKA ANDA MEMERLUKAN WAKTU UNTUK PEMBAYARAN", // your payment is going to expire soon. click OK if you still need time to pay
				statusChanged: "warned",
				showCancel: true,
				showModal: true
			});
			this._timerId = setTimeout(() => { this.cancelAtTimeOut(); this._timerId = 0 }, 60000);
		}
	}

	handleInitialStateChanges = () => {
		console.log("sale starts");
		const {checkQrStatus, statusChanged, retry} = this.state;
		if (checkQrStatus) {
			if (statusChanged === "initial") {
				if (this._isMounted) {
					this.setState({
						titleMsg: "WAKTU KONEKSI HABIS", //connection timeout
						contentMsg: "KONEKSI PEMBAYARAN ANDA TELAH HABIS. SILAKAN COBA LAGI!", // your payment connection is timeout. please try again
						statusChanged: "timeout",
						showModal: true
					});

					// set timeout to redirect home page after 10 seconds
					this._timerId = setTimeout(() => { this.handleTimeout(); this._timerId = 0; }, 10000); 
				}
			} else if (statusChanged === "timeout") {
				this.handleTimeout();
			}
		} else {
			if (this._isMounted) {
				this.setState({ retry: retry + 1});
			}
			this.requestQrCode();
		}
	}

	handleButtonOk = (event) => {
		const {statusChanged} = this.state;
		this.setState({ showModal: false });
		if (statusChanged === "warned") {
			if (this._isMounted) {
				// set timeout to wait 1 extra minute for payment, then invoke cancelAtTimeOut function
				this._timerId = setTimeout(() => { this.cancelAtTimeOut(); this._timerId = 0; }, 60000); 
			}
		} else if (statusChanged === "timeout" || statusChanged === "qrerror") {
			this.handleTimeout();
		} 
		console.log("Btn Status - " + statusChanged);
	}

	cancelAtTimeOut = async() => {
		const {transactionId, cancelBtnClicked} = this.state;
		const reqCancelQrCode = await SERVER_REQ.post(`/api/sales/cancel.json`, {'transaction_id': transactionId});
		console.log(reqCancelQrCode);

		if (reqCancelQrCode.response) {
			console.log("Transaction Status - " + reqCancelQrCode.response.transaction_status);
			console.log("Transaction Status Code - " + reqCancelQrCode.response.status_code);
			// cond: check payment cancellation by status or status code
			if (reqCancelQrCode.response.transaction_status === "cancel" || reqCancelQrCode.response.status_code === "412") { 
				if (cancelBtnClicked) {
					this.handleTimeout();
				} else {
					if (this._isMounted) {
						this.setState({
							titleMsg: "PEMBAYARAN KEDARLUWARSA", // payment expired
							contentMsg: "HARAP COBA KEMBALI!", // please try again
							statusChanged: "timeout",
							showCancel: false,
							showModal: true
						});
					}
					
					// set timeout to redirect home page after 10 seconds
					this._timerId = setTimeout(() => { this.handleTimeout(); this._timerId = 0; }, 10000); 
				}
			}
		}
	} 

	checkPaymentStatus = async() => {
		const {transactionId} = this.state;
		console.log(`${FORMATTER.api_base_url()}/api/sales/status.json?transaction_id=${transactionId}`);
		const reqPaymentStatus = await SERVER_REQ.get(`/api/sales/status.json?transaction_id=${transactionId}`);

		console.log(reqPaymentStatus);
		const response = reqPaymentStatus.response;
		if (response) {
			console.log("Transaction status - " + reqPaymentStatus.response.transaction_status);
			if (reqPaymentStatus.response.transaction_status === "settlement") {
				// redirect dispensing after payment success
				this.props.history.push(`/dispense/${response.slot_id}/${response.sale_id}`); 
			} else {
				if (this._isMounted) {
					this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, 1000);
				}
			}
		} else {
			if (this._isMounted) {
				this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, 1000);
			}
		}
	}

	// function to redirect home page and clear all intervals, timeouts and states
	handleTimeout = () => {
		this.setState({ showModal: false });
		this.props.history.push(this.state.redirectURL);
	}

	handleCancelPayment = () => {
		const {transactionId} = this.state;
		console.log(this._isMounted);
		if (transactionId) {
			if (this._isMounted) {
				this.setState({ 
					cancelBtnClicked: true, 
					showCancel: false 
				}, () => {
					this.cancelAtTimeOut();
				});
			}
		} else {
			this.props.history.push("/");
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
		if (this._timerId) { clearTimeout(this._timerId); this._timerId = 0; }
		clearInterval(this.state.intervalId);
		this.setState = (state, callback) => {
			return;
		};
  }

	render() {
		const {product, qrCodeURL, checkQrStatus, countdown = 121, showModal, showCancel, titleMsg, contentMsg, imgWidth, imgHeight} = this.state;

		return (<div className="vw-100 vh-100 d-flex align-items-center">
			<Container fluid className="text-uppercase">
				<Row>
					<Col lg={5} className="text-center"> 
						<p className="custom-t4 mb-3">ANDA TELAH MEMILIH </p> {/* you have choose */}
						<p className="custom-t1">{product.name}</p>
						<img src={`${FORMATTER.api_base_url()}${product.url}`} className="img-thumbnail custom-thumbnail border-0  text-center" alt="product" />
						<p className="custom-t1"><strong>{FORMATTER.money(product.price)}</strong></p>
					</Col>

					<Col lg={7} className="justify-content-center text-center">
						<div className="p-2 align-self-center">
							<p className="custom-t4">{checkQrStatus ? 'PINDAH KODE QR UNTUK PEMBAYARAN' : 'MEMINTA KODE QR'}</p>
						</div> {/* cond 1: scan qr code to pay, cond 2: requesting qr code */}
						<div className="w-100 text-center m-3">
							<img src={qrCodeURL} className="img-fluid" style={{width: imgWidth, height: imgHeight}} alt="QR CODE"></img>
						</div>

						<div className="align-self-center text-center">
							{countdown === 121 ? "" : <div>QR Code expire in {countdown} second(s)</div>}
							<button type="button" className="btn btn-primary btn-lg btn-info" onClick={this.handleCancelPayment}>
								<p className="custom-t1 mb-3 text-uppercase">BATALKAN PEMBAYARAN</p> {/* cancel payment */}
							</button>
						</div>
					</Col>
				</Row>

				<Modal show={showModal} size="xl" centered>
					<Modal.Header>
						<Modal.Title>
							<p className="custom-t2 text-uppercase">{titleMsg}</p>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="custom-t2 text-uppercase">{contentMsg}</p>
					</Modal.Body>
					<Modal.Footer className="text-center">
						<div className="text-center">
							<button type="button" style={{display: showCancel ? 'block' : 'none' }} onClick={this.handleCancelPayment} className="btn btn-lg btn-warning text-uppercase font-weight-bold " data-dismiss="modal">
								<h2 className="text-center text-uppercase custom-t2">BATAL</h2> {/* cancel */}
							</button>
						</div>

						<div className="text-center">
							<button type="button" onClick={this.handleButtonOk} className="btn btn-lg btn-info text-uppercase font-weight-bold ">
								<h2 className="text-center text-uppercase custom-t2">OK</h2>
							</button>
						</div>
					</Modal.Footer>
				</Modal>
			</Container>
		</div>);
	}
}

export default Sale;