import React from "react";
import { Link } from 'react-router-dom';
import '../../../App.css';

class ButtonMapping extends React.Component {

	constructor(props) {
		super(props); 
		this.state = { button_config_data: [] };
	}

	componentDidMount() {
		const url = '/button/mapping'; 

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => this.setState({ button_config_data: response }))
			.catch(() => this.props.history.push("/"));
	}
	
	onRadioChange(event) {
		console.log(event.target.value);
		// var elems = document.querySelectorAll(".radio-product.card-checked");
		// [].forEach.call(elems, function (el) {
		// 	el.classList.remove("card-checked");
		// });
		// event.target.closest("label").classList.toggle("card-checked");
	} 

	render() {
		const { button_config_data } = this.state;
		let products= button_config_data;

		const allProducts = products.map((product, index) => (
			<div key={index} className="col-md-6 col-lg-3 radio-product">
				<label className="radio-img">
					<input type="radio" id={index} name="radioProduct" onChange={this.onRadioChange}/>
					<div id={"card_" + index} className="card mb-4">
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
				<div className="vw-100 vh-100 d-flex">
					<div className="container-fluid">
						<div className="m-3">

							<div className="row col-12 justify-content-center">
								<h1 className="text-center text-uppercase display-4">Choose the product to map</h1>
							</div>

							<div className="row mt-5">

								<div className="row col-12 d-flex justify-content-center">
									{allProducts}
								</div>

								<div className="row col-12 d-flex justify-content-center mb-4">
									<div className="text-center col p-2 align-self-center">
										<Link to="/management" className="btn btn-lg btn-warning">
											<h2 className="text-center text-uppercase display-4">Cancel</h2>
										</Link>
									</div>

									<div className="text-center col p-2 align-self-center">
										<Link to="/management" className="btn btn-lg btn-info">
											<h2 className="text-center text-uppercase display-4">Confirm</h2>
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

export default ButtonMapping;