import {useState, useEffect} from "react";
import SERVER_REQ from '../../helpers/Request';
import { SocketContext } from '../../services/socket';
import LandingPage from "./buttons/LandingPage";
import Product from './buttons/Product';
import '../../App.css';
import { Button, Container, Image, Modal, Row } from 'react-bootstrap';
 
const ButtonMapping = (props) => {

	const [products, setProducts] = useState([]);
	const [mappedProduct, setMappedProduct] = useState({name: '', image_url: ''});
	const [tappedButton, setTappedButton] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(false);
	const [modalTextPostFix, setModalTextPostFix] = useState("Do you want to Edit?");
	const [confirmButtonText, setConfirmButtonText] = useState("confirm");

	const startSocket = () => {
		const self=this;
		let button_pressed = false;

		this.context.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 500, reply_to: 'set_button' });
		this.context.on('set_button', (data) => {
			data = JSON.parse(data);
			if(button_pressed) return;
			button_pressed = true;
			self.context.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 500, reply_to: 'set_button' });
			const button = data.button_no;

			setTappedButton(button, async() => {
				const url = `http://vending.smartvending.com/api/buttons/${button}/detail.json`;
				const button_req = await SERVER_REQ.get(url);
				const button_response = button_req.response
				const button_product = button_response.detail.product
				const unassigned_products = button_response.unassign_products;
				setMappedProduct(button_product);
				setProducts(unassigned_products);
			}, () => {
				if (button_product) {
					setShowModal(true);
				}
			});
			console.log(button_req);
		})
	}

	const stopSocket = () => {
		this.context.offAny('set_button');
		this.context.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 500, reply_to: 'set_button' });
	}

	useEffect(() => {
		startSocket();

		return function cleanup() {
      stopSocket();
    };
	});

	const handleCancelBtn = () => {
		props.history.push('/management')
	}

	const handleModalCancelBtn = () => {
		setShowModal(false);
		setTappedButton(false);
		setSelectedProduct(false);
		setMappedProduct({name: '', image_url: ''});

		return () => {
			startSocket();
		}
	}
	
	const handleOnRadioChange = (e) => {
		setSelectedProduct(parseInt(e.target.id));
	}

	const handleSubmitBtn = async () => {
		console.log(tappedButton, selectedProduct);
		const button_post = await SERVER_REQ.put(`http://vending.smartvending.com/api/buttons//${tappedButton}.json`, {'button[product_id]': selectedProduct});
		if (button_post.response.success) {
			const button_get =  await SERVER_REQ.get(`http://vending.smartvending.com/api/buttons/${tappedButton}/detail.json`);
			if (button_get.response.detail.product) {
				const button_product = button_get.response.detail.product;
				setMappedProduct(button_product);
				if (button_product) {
					setShowModal(true);
					setModalTextPostFix("");
					setConfirmButtonText("ok");
				}
			}
			console.log("Get " + button_get);
		}
		console.log("Post " + button_post);
	}

	const handleConfirmButtonOnClick = () => {
		const btnText = confirmButtonText;
		setShowModal(false);
		if (btnText === "ok") handleModalCancelBtn();
	}
	
	console.log(products);

	return (
		<Container fluid>
			{tappedButton ? <Product products={products} selectedProduct={selectedProduct} handleCancelBtn={handleModalCancelBtn} handleOnRadioChange={handleOnRadioChange} handleSubmitBtn={handleSubmitBtn} /> : <LandingPage handleCancelBtn={handleCancelBtn} />}

			<Modal show={showModal} size="lg" centered>
				<Modal.Body>
					<Row className="w-100 justify-content-center text-uppsercase custom-t2 text-center">
						<Image alt={mappedProduct.name} src={`http://vending.smartvending.com${mappedProduct.image_url}`} />
						This button is mapped to {mappedProduct.name}. {modalTextPostFix}
					</Row>
				</Modal.Body>
				<Modal.Footer className="text-center">
					<Button variant="warning" onClick={handleModalCancelBtn} className="text-uppercase custom-t2">
						cancel
					</Button>
					<Button variant="info" onClick={handleConfirmButtonOnClick} className="text-uppercase custom-t2">
						{confirmButtonText}
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}

ButtonMapping.contextType = SocketContext;
export default ButtonMapping;