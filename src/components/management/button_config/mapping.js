import React from "react";
import { Link } from 'react-router-dom';
import '../../../App.css';

class ManagementButtonMapping extends React.Component {

	constructor(props) {
		super(props); 
		this.state = { 
			products: [],
			buttonName: "",
			productId: "",
			productName: "",
			productURL: ""
		};
	}

	componentDidMount() {
		const url = 'http://vending.smartvending.com/api/buttons.json'; 

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				this.setState({ products: response.products });
			})
			.catch(() => this.props.history.push("/"));

		this.handleOnSubmit = this.handleOnSubmit.bind(this);
		this.handleOnRadioChange = this.handleOnRadioChange.bind(this);
	}
	
	handleOnRadioChange = (event) => {
		var getLabels = document.querySelectorAll(".radio-img");
		getLabels.forEach.call(getLabels, function (lbl) {
			lbl.classList.remove("card-checked");
		});
		if (event.target.value === "on") {
			this.setState({ 
				productId: event.target.id,
				buttonName: event.target.id,
				productName: event.target.getAttribute("data-name"),
				productURL: event.target.getAttribute("data-url")
			});

			document.getElementById("lbl-" + event.target.id).classList.toggle("card-checked");
			document.getElementById("open-modal").click();
		}
	} 

	handleOnSubmit = (event) => {
		event.preventDefault();
		const url = '/button/mapping';
		const name = this.state.productId;
		const product_id = this.state.buttonName;

		if (product_id.length === 0)
      		return;

		const body = {
			name,
			product_id
		}

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(body)
		})
			.then(response => {
				console.log(response);
				if (response.ok) {
					return response.json();
				} 
			})
			.then(response => { this.props.history.push("/management/button_config") })
			.catch(error => console.log(error.message));

		document.getElementById("close-modal").click();
	}

	handleConfirmButtonOnClick = (event) => {
		document.getElementById("btn-submit").click();
	}

	render() {
		const products = this.state.products;
		const productName = this.state.productName;
		const productURL = this.state.productURL;

		const allProducts = products.map((product, index) => (
			<div key={index} className="col-md-6 col-lg-3 radio-product">
				<input type="radio" id={product.id} data-name={product.name} data-url={product.image_url} name="radioProduct" onChange={this.handleOnRadioChange}/>
				<label id={"lbl-" + product.id} className="radio-img mb-4" htmlFor={product.id}> 
					<div id={"card_" + index} className="card">
						<img
							src={product.image_url}
							className="card-img-top btn-thumbnail"
							alt={product.name}
						/>
						<div className="card-body text-center">
							<h1 className="card-title">{product.name}</h1>
						</div>
					</div>
				</label>
			</div>
		));
		
		return (
			<>
				<form onSubmit={this.handleOnSubmit}>
					<div className="vw-100 vh-100 d-flex">
						<div className="container-fluid">
							<div className="m-3">

								<div className="row col-12 justify-content-center">
									<h1 className="text-center text-uppercase display-4">Choose the product to map</h1>
								</div>

								<div className="row mt-5">
									<div className="row col-12 d-flex justify-content-center">
										{products.length > 0 ? allProducts : "No Data"}
									</div>
								</div>

								<div className="text-center mb-5">
									<Link to="/management/button_config">
										<button type="button" className="btn btn-lg btn-warning text-uppercase font-weight-bold" data-dismiss="modal">
											<h2 className="text-center text-uppercase custom-t2">Cancel</h2>
										</button>
									</Link>
								</div>

							</div>
						</div>
					</div>

					<button id="btn-submit" type="submit" className="btn btn-lg btn-info text-uppercase font-weight-bold d-none"  >
						<h2 className="text-center text-uppercase custom-t2">Submit</h2>
					</button>
				</form>

				<button id="open-modal" type="button" className="d-none"  data-toggle="modal" data-target="#myModal" data-dismiss="modal" aria-label="Close">Hidden Button</button>
				<div id="myModal" className="modal text-uppercase" tabIndex="-1" role="dialog">
					<div className="modal-dialog modal-xl modal-en" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title display-4">Confirm the Product</h4>
								<button id="close-modal" type="button" className="close custom-t1" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="row col-12">
									<div className="col-4 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center">
											<img src={productURL} className="img-thumbnail border-0" alt="product" />
										</div>
									</div>

									<div className="col-8 d-flex flex-column justify-content-center">
 										<h4 className="modal-title custom-t2 font-weight-normal">You've chosen <strong>{productName}</strong>. Please confirm!</h4>
									</div>
								</div>
							</div>
							<div className="modal-footer p-2">
								<div className="text-center">
									<button type="button" className="btn btn-lg btn-warning text-uppercase font-weight-bold" data-dismiss="modal">
										<h2 className="text-center text-uppercase custom-t2">Cancel</h2>
									</button>
								</div>

								<div className="text-center">
									<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold"  onClick={this.handleConfirmButtonOnClick}>
										<h2 className="text-center text-uppercase custom-t2">Confirm</h2>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

}

export default ManagementButtonMapping;