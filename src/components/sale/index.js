import React from "react";
import SERVER_REQ from '../../helpers/Request';
import FORMATTER from '../../helpers/Formatter';
import '../../App.css';
import logo from '../../assets/static_images/Logo.png';
import loadingQr from '../../assets/static_images/loadingQr.png';
import sampleImage from '../../assets/static_images/cola.jpg';
import { Modal, Container, Row, Col } from 'react-bootstrap';

class Sale extends React.Component {
	_isMounted = false;
	_timerId = 0;

	constructor(props) {
		super(props); 
		this.state = { 
			sale_data: {},
			qrCodeURL: loadingQr,
			transactionId: "",
			titleMsg: "",
			contentMsg: "",
			statusChanged: "initial",
			redirectURL: "/",
			checkQrStatus: false,
			retry: 0,
			countdown: 121,
			afterCountdown: 60,
			requestStatatusAfter: 2,
			cancelBtnClicked: false,
			product:{id: '', name: '', url: '', price: 1},
			showCancel: false, // modal's cancel button flag
			loadingQR: true,
			showModal: false,
			imgWidth: "35vw",
			imgHeight: "60vh",
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
		// console.log(urlParams)
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
		console.log("PRODUCT", product)
		const reqQrCode = await SERVER_REQ.post(`/api/sales/payment.json`, {'amount': product.price, 'product_id': product.id});
		
		// console.log(reqQrCode);

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
						imgWidth: "35vw",
						imgHeight: "60vh",
						transactionId: reqQrCode.response.transaction_id,
						checkQrStatus: true,
						countdown: reqQrCode.response.payment_timeout,
						afterCountdown: reqQrCode.response.payment_wait_after_timeout,
						requestStatatusAfter: reqQrCode.response.payment_status_request_after,
						intervalId: setInterval(() => {
							let countdown = this.state.countdown;
							if(this.state.countdown === 0){
								countdown = reqQrCode.response.payment_timeout
								clearInterval(this.state.intervalId)
								this.warningTimeOut();
							} else {
								countdown -= 1;
								// console.log("countdown - " + countdown);
							}
							this.setState({ countdown: countdown });
						}, 1000)
					}, () => {
						console.log(`request after => ${this.state.requestStatatusAfter }`)
						this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, this.state.requestStatatusAfter * 1000);
					});
				}
			// } else if (reqQrCode.response.status_code === "400" || reqQrCode.response.status_code === "401" || reqQrCode.response.status_code === "402" || reqQrCode.response.status_code === "406" || reqQrCode.response.status_code === "410") { 
			} else if (["400","401","402","406","410"].includes(reqQrCode.response.status_code)) { 
				// possible error codes for payment is 400, 401, 402, 406, and 410
				// console.log("Status code - " + reqQrCode.response.status_code);
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
				titleMsg: "WAKTU TUNGGU AKAN SEGERA HABIS", // the waiting time will end soon
				contentMsg: "TAMBAHKAN WAKTU TUNGGU?", // add waiting time
				statusChanged: "warned",
				showCancel: true,
				showModal: true
			});
			this._timerId = setTimeout(() => { this.cancelAtTimeOut(); this._timerId = 0 }, 60000);
		}
	}

	handleInitialStateChanges = () => {
		// console.log("sale starts");
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
		// console.log("Btn Status - " + statusChanged);
	}

	cancelAtTimeOut = async() => {
		const {transactionId, cancelBtnClicked} = this.state;
		const reqCancelQrCode = await SERVER_REQ.post(`/api/sales/cancel.json`, {'transaction_id': transactionId});
		// console.log(reqCancelQrCode);

		if (reqCancelQrCode.response) {
			// console.log("Transaction Status - " + reqCancelQrCode.response.transaction_status);
			// console.log("Transaction Status Code - " + reqCancelQrCode.response.status_code);
			// cond: check payment cancellation by status or status code
			if (reqCancelQrCode.response.transaction_status === "cancel" || reqCancelQrCode.response.status_code === "412") { 
				if (cancelBtnClicked) {
					this.handleTimeout();
				} else {
					if (this._isMounted) {
						this.setState({
							titleMsg: "PEMBAYARAN TIDAK BERHASIL", // payment expired
							contentMsg: "MOHON DICOBA KEMBALI", // please try again
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
		const {search} = this.props.location;
		const urlParams = new URLSearchParams(search);
		const slots = urlParams.get('slots')
		const firstSlot = slots.split(',')[0]
		// console.log(`${FORMATTER.api_base_url()}/api/sales/status.json?transaction_id=${transactionId}`);
		const reqPaymentStatus = await SERVER_REQ.get(`/api/sales/status.json?transaction_id=${transactionId}&slot=${firstSlot}`);

		// console.log(reqPaymentStatus);
		const response = reqPaymentStatus.response;
		if (response) {
			// console.log("Transaction status - " + reqPaymentStatus.response.transaction_status);
			if (reqPaymentStatus.response.transaction_status === "settlement") {
				// redirect dispensing after payment success
				this.props.history.push(`/dispense/${response.sale_id}?slots=${slots}`); 
			} else {
				if (this._isMounted) {
					this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, this.state.requestStatatusAfter * 1000);
				}
			}
		} else {
			if (this._isMounted) {
				this._timerId = setTimeout(() => { this.checkPaymentStatus(); this._timerId = 0; }, this.state.requestStatatusAfter * 1000);
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
		// console.log(this._isMounted);
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
		// this.setState = (state, callback) => {
		// 	return;
		// };
  	}

	render() {
		const {product, qrCodeURL, checkQrStatus, countdown = 121, showModal, showCancel, titleMsg, contentMsg, imgWidth, imgHeight} = this.state;

		return (<div className="vw-100 vh-100 d-flex justify-content-center background-Img">
			<Container fluid className="text-uppercase">
				<Row className="align-items-center mt-4 mb-5 ml-5 mr-5">
					<Col lg={5} className="text-center">
						<div className="pt-1 pb-2">
							<img src={logo} className="img-fluid mini-logo" alt="logo"></img>
						</div> 
						<div className="w-100 text-center m-3">
							<img src={qrCodeURL} className="img-fluid" style={{width: imgWidth, height: imgHeight}} alt="QR CODE"></img>
						</div>

						<div className="text-center">
							{countdown === 121 ? "" : <div>QR Code expire in {countdown} second(s)</div>}
							<button type="button" className="btn btn-primary btn-lg btn-warning custom-t2 text-uppercase cancel-btn-style p-5" onClick={this.handleCancelPayment} >
								BATALKAN PEMBAYARAN {/* cancel payment */}
							</button>
						</div>
					</Col>

					<Col lg={7} className="p-5"> 
						<Row className="mb-3 pl-5">
							<p style={{fontSize: "3vw"}}>ANDA TELAH MEMILIH </p> {/* you have choose */}
						</Row>
						<Row className="align-items-center">
							<Col>
								<img src={`${FORMATTER.api_images()}${product.url}`} className="img-fluid" style={{width: "22vw", height: "20vw"}} alt="Product"></img>
								{/* <img src={sampleImage} className="img-fluid" style={{width: "18vw", height: "16vw"}} alt="QR CODE"></img> */}
							</Col>
							<Col className>
								<p style={{fontSize: "2vw"}}>{product.name}</p>
								{/* <p style={{fontSize: "2vw"}}>Coca Coca Coca Coca Coca Coca Coca Cola</p> */}
								<p className="cyan-text" style={{fontSize: "4vw"}}><strong>{FORMATTER.money(product.price)}</strong></p>
							</Col>
						</Row>
						<Row className="mt-4">
							<p style={{fontSize: "2.5vw"}}>{checkQrStatus ? 'PINDAI KODE QR UNTUK PEMBAYARAN' : ''}</p> {/* cond 1: scan qr code to pay, cond 2: requesting qr code */}
						</Row>
					</Col>
				</Row>

				<Modal show={showModal} size="xl" centered className="rounded-3">
					<Modal.Header className="modal-background">
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