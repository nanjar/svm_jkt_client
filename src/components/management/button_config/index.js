import React from "react";
import { Link } from 'react-router-dom';
import '../../../App.css';

class ButtonConfig extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mappedProducts: [],
			mappedProductIds: [],
			mappedButtonIds: [],
			mappedProductName: "",
			buttonId: 0
		};
	}

	componentDidMount() {
		const url = "/button/config";

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				this.setState({ 
					mappedProducts: response.mapped_products,
					mappedProductIds: response.mapped_product_ids,
					mappedButtonIds: response.mapped_button_ids
				});
			})
			.catch(() => this.props.history.push("/"));
		
		this.handleButtonOnClick = this.handleButtonOnClick.bind(this);
		this.handleConfirmButtonOnClick = this.handleConfirmButtonOnClick.bind(this);
	}

	handleButtonOnClick = (event) => {
		event.preventDefault();

		const clickedButtonId = parseInt(event.target.value);
		const mappedProducts = this.state.mappedProducts;
		const mappedProductIds = this.state.mappedProductIds;
		const mappedButtonIds = this.state.mappedButtonIds;

		if (mappedButtonIds.length > 0) {
			if (mappedButtonIds.includes(clickedButtonId)) {
				mappedProducts.forEach(element => {
					if (mappedProductIds.includes(element.id)) {
						this.setState({ mappedProductName: element.name });
					}
				});
				
				this.setState({ buttonId: event.target.value });
				document.getElementById("open-modal").click();
			} else {
				this.props.history.push("/management/button_mapping/0");
			}
		} else {
			this.props.history.push("/management/button_mapping/0");
		}
	}

	// handle DELETE product-button paired
	handleConfirmButtonOnClick = (event) => {
		document.getElementById("modal-close").click();
		const checkButtonId = parseInt(event.target.getAttribute("data-buttonid"));
		if (checkButtonId === 0) {
			this.props.history.push("/management/button_mapping/" + checkButtonId);	
		} else {
			const url = '/button/mapping/' + this.state.buttonId;
			const myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');
			fetch(url, {
				method: 'DELETE',
				headers: myHeaders,
				mode: 'cors',
				cache: 'default'
			})
				.then(response => {
					console.log(response);
					if (response.ok) {
						return response.json();
					} 
					throw new Error("Network response was not ok.");
				})
				.then(() => { this.props.history.push("/management/button_mapping/0") })
				.catch(error => console.log(error.message));
		}
	}

	render() {
		const productName = this.state.mappedProductName;
		const buttonId = this.state.buttonId;

		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">

							<div className="row col-12 justify-content-center">
								<h1 className="text-center text-uppercase display-4">Press the button to configure</h1>
							</div>

							<div className="row">
								<button id="open-modal" type="button" className="d-none"  data-toggle="modal" data-target="#myModal" data-dismiss="modal" aria-label="Close">Hidden Button</button>
								<div className="row col-12 d-flex justify-content-center p-5">
									<Link to="/management/button_mapping">
										<button value="1" className="btn btn-lg btn-info m-3 text-center text-uppercase custom-t1" type="button" onClick={this.handleButtonOnClick}>
											Button 1
										</button>
									</Link>
									<Link to="/management/button_mapping">
										<button value="2" className="btn btn-lg btn-info m-3 text-center text-uppercase custom-t1" type="button" onClick={this.handleButtonOnClick}>
											Button 2
										</button>
									</Link>
									<Link to="/management/button_mapping">
										<button value="3" className="btn btn-lg btn-info m-3 text-center text-uppercase custom-t1" type="button" onClick={this.handleButtonOnClick}>
											Button 3
										</button>
									</Link>
									<Link to="/management/button_mapping">
										<button value="4" className="btn btn-lg btn-info m-3 text-center text-uppercase custom-t1" type="button" onClick={this.handleButtonOnClick}>
											Button 4
										</button>
									</Link>
									<Link to="/management/button_mapping">
										<button value="5" className="btn btn-lg btn-info m-3 text-center text-uppercase custom-t1" type="button" onClick={this.handleButtonOnClick}>
											Button 5
										</button>
									</Link>
								</div>

								<div className="row col-12 d-flex justify-content-center mb-4">
									<div className="text-center col p-2 align-self-center">
										<Link to="/management">
											<button className="btn btn-lg btn-warning m-3 text-center text-uppercase custom-t1" type="button">
												Cancel
											</button>
										</Link>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			
				<div id="myModal" className="modal text-uppercase" tabIndex="-1" role="dialog">
					<div className="modal-dialog modal-xl modal-en" role="document">
						<div className="modal-content">
							<div className="modal-body">
								<div className="row col-12">
									<button id="modal-close" type="button" className="close custom-t1 d-none" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
									<h4 className="modal-title display-4">This button is mapped to {productName}. Do you want ot Edit?</h4>
								</div>
							</div>
							<div className="modal-footer p-2">
								<div className="text-center">
									<button type="button" className="btn btn-lg btn-warning text-uppercase font-weight-bold" data-dismiss="modal">
										<h2 className="text-center text-uppercase custom-t2">Cancel</h2>
									</button>
								</div>

								<div className="text-center">
									{/* <Link to="/management/button_mapping" className="btn btn-lg btn-info"> */}
									<button type="button" data-buttonid={buttonId} className="btn btn-lg btn-info text-uppercase font-weight-bold"  onClick={this.handleConfirmButtonOnClick}>
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

export default ButtonConfig;