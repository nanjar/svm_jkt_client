import React from "react";
// import ActionCable from 'actioncable';
import { Link } from "react-router-dom";
import '../../App.css';
import btn_gopay from '../../assets/static_images/gopay.png';
import product_img from '../../assets/static_images/cola.jpg';

class Cart extends React.Component {
	constructor(props) {
		super(props); 
		this.state = { cart_data: {} };
		this.matchMakingChannel = {}

		// this.cable = ActionCable.createConsumer('ws://localhost:3001/cable');
	}

	componentDidMount() {
		// const {
		// 	match: {
		// 		params: { id }
		// 	}
		// } = this.props;

		// const url = '/api/cart/' + id; // id would be the selected product_id

		// fetch(url)
		// 	.then(response => {
		// 		if (response.ok) {
		// 			return response.json();
		// 		}
		// 		throw new Error("Network response was not ok.");
		// 	})
		// 	.then(response => this.setState({ cart_data: response }))
		// 	.catch(() => this.props.history.push("/"));
	}

	render() {
		const product = this.state.cart_data;
		console.log(product)

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
										<img src={btn_gopay} className="img-fluid" alt="TEKAN TOMBOL UNTUK MEMULAI"></img>
									</div>
									<div className="p-2 align-self-center mt-3">
										<Link to={"/payment/gopay/" + 3500}  className="btn btn-primary btn-lg btn-info">
											<h2 className="display-4">Klik Disini</h2>
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

export default Cart;