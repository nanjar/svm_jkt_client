import React from "react";
import SERVER_REQ from '../../helpers/Request';
import FORMATTER from '../../helpers/Formatter';
import { SocketContext } from '../../services/socket';
import LandingPage from "./buttons/LandingPage";
import Product from './buttons/Product';
import '../../App.css';
import { Button, Container, Image, Modal, Row } from 'react-bootstrap';
import IdleTimer from 'react-idle-timer';

 
class ButtonMapping extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			mappedProduct: {
				name: '',
				image_url: ''
			},
			tappedButton: false,
			showAckModal: false,
			showConfirmModal: false,
			selectedProduct: false,
			timeout: 1000 * 60 * 10,
            isTimedOut: false
		}
		
		this.idleTimer = null;
		this.handleCancelBtn = this.handleCancelBtn.bind(this);
		this.handleModalCancelBtn = this.handleModalCancelBtn.bind(this);
		this.handleOnRadioChange = this.handleOnRadioChange.bind(this);
		this.handleSubmitBtn = this.handleSubmitBtn.bind(this);
		this.handleConfirmButtonOnClick  = this.handleConfirmButtonOnClick.bind(this);
		this.startSocket = this.startSocket.bind(this);
		this.stopSocket = this.stopSocket.bind(this);
		this.handleAckModalButton = this.handleAckModalButton.bind(this);
	}

	startSocket = () => {
		const self=this;
		let button_pressed = false;
		if(window.location.hostname !== "localhost" )
			return
		this.context.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 1000, reply_to: 'set_button' });
		this.context.on('set_button', (data) => {
			data = JSON.parse(data);
			if(button_pressed) return;
			button_pressed = true;
			self.context.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 500, reply_to: 'set_button' });
			const button = data.button_no;
			self.setState({ tappedButton: button }, async () => {
				const url = `/api/buttons/${button}/detail.json`;
				const button_req = await SERVER_REQ.get(url);
				const button_response = button_req.response
				const button_product = button_response.detail.product
				const unassigned_products = button_response.unassign_products;
				this.setState({mappedProduct: button_product, products: unassigned_products}, () =>{
					if( button_product ) {
						this.setState({showConfirmModal: true});
					} 
				});
				// console.log(button_req)
			})
		})
	}

	stopSocket = () => {
		if(window.location.hostname !== "localhost" )
			return
		this.context.offAny('set_button');
		this.context.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 500, reply_to: 'set_button' });
	}

	componentDidMount() {
		this.startSocket();
	}

	handleCancelBtn = () => {
		this.props.history.push('/management')
	}

	handleModalCancelBtn = () => {
		this.setState({
			showConfirmModal: false, 
			tappedButton: false,
			selectedProduct: false,
			mappedProduct: {
				name: '',
				image_url: ''
			}
		}, () => {
			this.startSocket();
		});
	}
	
	handleOnRadioChange = (e) => {
		const selectedProduct = parseInt(e.target.id)
		this.setState({ selectedProduct: selectedProduct });
	}

	handleSubmitBtn = async () => {
		const {tappedButton, selectedProduct} = this.state;
		// console.log(tappedButton, selectedProduct);
		const button_post = await SERVER_REQ.put(`/api/buttons/${tappedButton}.json`, {'button[product_id]': selectedProduct});
		if (button_post.response.success) {
			const button_get =  await SERVER_REQ.get(`/api/buttons/${tappedButton}/detail.json`);
			if (button_get.response.detail.product) {
				const button_product = button_get.response.detail.product;
				this.setState({ mappedProduct: button_product}, () => {
					if( button_product ) {
						this.setState({
							showAckModal: true
						})
					} 
				});
			}
			// console.log("Get " + button_get);
		}
		// console.log("Post " + button_post);
	}

	handleConfirmButtonOnClick = () => {
		const btnText = this.state.confirmButtonText;
		this.setState({ 
			showConfirmModal: false
		});
	}

	handleAckModalButton = () => {
		this.setState({
			showAckModal: false, 
			tappedButton: false,
			selectedProduct: false,
			mappedProduct: {
				name: '',
				image_url: ''
			}
		}, () => {
			this.startSocket();
		});
	}

	componentWillUnmount() {
		this.stopSocket();
	}

	handleOnAction = (e) => {
		// console.log('time remaining action', this.idleTimer.getRemainingTime())
		this.setState({ timeout: 1000 * 60 * 10 });
	}
	 
	handleOnActive = (e) => {
		// console.log('time remaining active', this.idleTimer.getRemainingTime())
		this.setState({ itimeout: 1000 * 60 * 10 });
	}
	
	handleOnIdle = (e) => {
		if (this.idleTimer.getRemainingTime() == 0) {
			this.props.history.push('/');
		}
	}

	render() {
		const {tappedButton, mappedProduct={}, showConfirmModal, showAckModal, products, selectedProduct, timeout} = this.state;
		// console.log(products);

		return ( <div>
			<IdleTimer
				ref={ref => { this.idleTimer = ref }}
				timeout={ timeout }
				onActive={this.handleOnActive}
				onIdle={this.handleOnIdle}
				onAction={this.handleOnAction}
				debounce={250}
			/>

			<Container fluid className="overflow-hidden">
				{tappedButton ? <Product products={products} selectedProduct={selectedProduct} handleCancelBtn={this.handleModalCancelBtn} handleOnRadioChange={this.handleOnRadioChange} handleSubmitBtn={this.handleSubmitBtn} /> : <LandingPage handleCancelBtn={this.handleCancelBtn} />}

				<Modal show={showConfirmModal} size="lg" centered>
					<Modal.Body>
						<Row className="w-100 justify-content-center text-center">
							<Image className="thumbnail product-thumbnail" alt={mappedProduct.name} src={`${FORMATTER.api_images()}${mappedProduct.image_url}`} />
							<p className="text-uppsercase custom-t22">TOMBOL {tappedButton} DIPETAKAN UNTUK : <strong>{mappedProduct.name}</strong> <br/>APAKAH INGIN DISUNTING?</p>
						</Row> {/* button 5 is mapped to */}

					</Modal.Body>
					<Modal.Footer className="text-center">
						<Button variant="warning" onClick={this.handleModalCancelBtn} className="text-uppercase custom-t2 p-3">
							BATAL {/* cancel */}
						</Button>
						<Button variant="info" onClick={this.handleConfirmButtonOnClick} className="text-uppercase custom-t2 p-3">
							LANJUT {/* confirm */}
						</Button> 
					</Modal.Footer>
				</Modal>

				<Modal show={showAckModal} size="lg" centered>
					<Modal.Body>
						<Row className="w-100 justify-content-center text-center">
							<Image className="thumbnail product-thumbnail" alt={mappedProduct.name} src={`${FORMATTER.api_images()}${mappedProduct.image_url}`} />
							<p className="text-uppsercase custom-t22">TOMBOL {tappedButton} DIPETAKAN UNTUK : <strong>{mappedProduct.name}</strong> </p>
						</Row> {/* button 5 is mapped to */}

					</Modal.Body>
					<Modal.Footer className="text-center">
						<Button variant="info" onClick={this.handleAckModalButton} className="text-uppercase custom-t2 p-3">
							OK
						</Button>
					</Modal.Footer>
				</Modal>
			</Container>
		</div>);
	}
}

ButtonMapping.contextType = SocketContext;
export default ButtonMapping;