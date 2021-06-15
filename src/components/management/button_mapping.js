import React from "react";
import { Link } from 'react-router-dom';
import SERVER_REQ from '../../helpers/Request';
import { SocketContext } from '../../services/socket';
import LandingPage from "./buttons/LandingPage";
import Product from './buttons/Product';
import '../../App.css';

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
			selectedProduct: false
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
				const url = `http://vending.smartvending.com/api/buttons/${button}.json`;
				const button_req = await SERVER_REQ.get(url);
				const button_response = button_req.response
				const button_product = button_response.detail.product
				const unassigned_products = button_response.unassign_products;
				this.setState({mappedProduct: button_product, products: unassigned_products}, () =>{
					if( button_product ){
						this.setState({showModal: true})
					}else{

					}
				})
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

	MappingButton = (props) => {
		const { products } = this.state;
		console.log(products)
		return <div className="row">
			{
				products.map((product, index) => (
					<div key={index} className="col-md-6 col-lg-3 radio-product">
						<input type="radio" id={product.id} data-name={product.name} data-url={`http://vending.smartvending.com${product.image_url}`} name="radioProduct" onChange={this.handleOnRadioChange}/>
						<label id={"lbl-" + product.id} className="radio-img mb-4" htmlFor={product.id}> 
							<div id={"card_" + index} className="card">
								<img
									src={`http://vending.smartvending.com${product.image_url}`}
									className="card-img-top btn-thumbnail"
									alt={product.name}
								/>
								<div className="card-body text-center">
									<h1 className="card-title">{product.name}</h1>
								</div>
							</div>
						</label>
					</div>
				))
			}
		</div>
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
		this.setState({ selectedProduct })
	}

	handleSubmitBtn = async () => {
		const {tappedButton, selectedProduct} = this.state;
		console.log(tappedButton, selectedProduct);
		const button_post = await SERVER_REQ.put(`http://vending.smartvending.com/api/buttons//${tappedButton}.json`, {'button[product_id]': selectedProduct});
		console.log(button_post)
	}

	handleConfirmButtonOnClick = () => {
		this.setState({showModal: false});
	}

	componentWillUnmount(){
		this.stopSocket();
	}

	render() {
		const {tappedButton, mappedProduct={}, showModal = false, products, selectedProduct} = this.state;
		console.log(products);
		return (
			<div className="vw-100 vh-100 d-flex align-items-center text-center">
				<div className="container-fluid">
					{tappedButton ? <Product products={products} selectedProduct={selectedProduct} handleCancelBtn={this.handleModalCancelBtn} handleOnRadioChange={this.handleOnRadioChange} handleSubmitBtn={this.handleSubmitBtn} /> : <LandingPage handleCancelBtn={this.handleCancelBtn} />}
				</div>
				{showModal ? 
					<div id="myModal" className="modal text-uppercase" tabIndex="-1" role="dialog">
						<div className="modal-dialog modal-xl modal-en" role="document">
							<div className="modal-content">
								<div className="modal-body">
									<div className="row col-12">
										<button id="modal-close" type="button" className="close custom-t1 d-none" data-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">&times;</span>
										</button>
										<div className="text-center w-100"><img src={`http://vending.smartvending.com${mappedProduct.image_url}`} /></div>
										<h4 className="modal-title display-4">This button is mapped to {mappedProduct.name}. Do you want to Edit?</h4>
									</div>
								</div>
								<div className="modal-footer p-2">
									<div className="text-center">
										<button type="button" className="btn btn-lg btn-warning text-uppercase font-weight-bold" onClick={this.handleModalCancelBtn}>
											<h2 className="text-center text-uppercase custom-t2">Cancel</h2>
										</button>
									</div>

									<div className="text-center">
										{/* <Link to="/management/button_mapping" className="btn btn-lg btn-info"> */}
										<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold"  onClick={this.handleConfirmButtonOnClick}>
											<h2 className="text-center text-uppercase custom-t2">Confirm</h2>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					:
					''}
			</div>
		);
	}
}
ButtonMapping.contextType = SocketContext;
export default ButtonMapping;