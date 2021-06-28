import React from "react";
import SERVER_REQ from '../../helpers/Request';
import { SocketContext } from '../../services/socket';
import LandingPage from "./buttons/LandingPage";
import Product from './buttons/Product';
import '../../App.css';
import { Button, Container, Image, Modal, Row } from 'react-bootstrap';
 
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
			showModal: false,
			selectedProduct: false,
			modalTextPostFix: "APAKAH ANDA INGIN MENYUNTING?", // do you want to edit?
			confirmButtonText: "LANJUT" // confirm 
		}
		this.handleCancelBtn = this.handleCancelBtn.bind(this);
		this.handleModalCancelBtn = this.handleModalCancelBtn.bind(this);
		this.handleOnRadioChange = this.handleOnRadioChange.bind(this);
		this.handleSubmitBtn = this.handleSubmitBtn.bind(this);
		this.handleConfirmButtonOnClick  = this.handleConfirmButtonOnClick.bind(this);
		this.startSocket = this.startSocket.bind(this);
		this.stopSocket = this.stopSocket.bind(this);
	}

	startSocket = () => {
		const self=this;
		let button_pressed = false;

		this.context.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 500, reply_to: 'set_button' });
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
						this.setState({showModal: true})
					} 
				});
				console.log(button_req)
			})
		})
	}

	stopSocket = () => {
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
			showModal: false, 
			tappedButton: false,
			selectedProduct: false,
			mappedProduct: {
				name: '',
				image_url: ''
			}
		}, () => {
			this.startSocket();
		})
	}
	
	handleOnRadioChange = (e) => {
		const selectedProduct = parseInt(e.target.id)
		this.setState({ selectedProduct: selectedProduct });
	}

	handleSubmitBtn = async () => {
		const {tappedButton, selectedProduct} = this.state;
		console.log(tappedButton, selectedProduct);
		const button_post = await SERVER_REQ.put(`${process.env.REACT_APP_API}/api/buttons//${tappedButton}.json`, {'button[product_id]': selectedProduct});
		if (button_post.response.success) {
			const button_get =  await SERVER_REQ.get(`${process.env.REACT_APP_API}/api/buttons/${tappedButton}/detail.json`);
			if (button_get.response.detail.product) {
				const button_product = button_get.response.detail.product;
				this.setState({ mappedProduct: button_product}, () => {
					if( button_product ) {
						this.setState({
							showModal: true,
							modalTextPostFix: "",
							confirmButtonText: "OK",
						})
					} 
				});
			}
			console.log("Get " + button_get);
		}
		console.log("Post " + button_post);
	}

	handleConfirmButtonOnClick = () => {
		const btnText = this.state.confirmButtonText;
		this.setState({ showModal: false });
		if (btnText === "ok") this.handleModalCancelBtn();
	}

	componentWillUnmount(){
		this.stopSocket();
	}

	render() {
		const {tappedButton, mappedProduct={}, showModal, products, selectedProduct, modalTextPostFix, confirmButtonText} = this.state;
		console.log(products);

		return (
			<Container fluid>
				{tappedButton ? <Product products={products} selectedProduct={selectedProduct} handleCancelBtn={this.handleModalCancelBtn} handleOnRadioChange={this.handleOnRadioChange} handleSubmitBtn={this.handleSubmitBtn} /> : <LandingPage handleCancelBtn={this.handleCancelBtn} />}

				<Modal show={showModal} size="lg" centered>
					<Modal.Body>
						<Row className="w-100 justify-content-center text-center">
							<Image className="thumbnail product-thumbnail" alt={mappedProduct.name} src={`${process.env.REACT_APP_API}${mappedProduct.image_url}`} />
							<p className="text-uppsercase custom-t2">TOMBOL INI DIPETAKAN UNTUK {mappedProduct.name}. {modalTextPostFix}</p>
						</Row> {/* this button is mapped to */}
					</Modal.Body>
					<Modal.Footer className="text-center">
						<Button variant="warning" onClick={this.handleModalCancelBtn} className="text-uppercase custom-t2">
							BATAL {/* cancel */}
						</Button>
						<Button variant="info" onClick={this.handleConfirmButtonOnClick} className="text-uppercase custom-t2">
							{confirmButtonText}
						</Button>
					</Modal.Footer>
				</Modal>
			</Container>
		);
	}
}

ButtonMapping.contextType = SocketContext;
export default ButtonMapping;