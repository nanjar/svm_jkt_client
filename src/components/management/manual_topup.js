import React from "react";
import { Link } from 'react-router-dom';
import '../../App.css';

class ManualTopup extends React.Component {
	constructor(props) {
		super(props);
		// this.state = { 
		// 	restock_data: {}
		// };

		this.state = { 
			restock_qty: 7,
			max_qty: 12,
			error: null,
		};


		this.handlePlus = this.handlePlus.bind(this);
		this.handleMinus = this.handleMinus.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
	}

	handlePlus() {
		if (this.state.restock_qty < this.state.max_qty) {
			this.setState({ restock_qty: this.state.restock_qty + 1 });
		} else {
			this.setState({ error: "No stock" });
		}
	}

	handleMinus() {
		if (this.state.restock_qty > 0) {
			this.setState({ restock_qty: this.state.restock_qty - 1 });
		} else {
			this.setState({ error: "No items" });
		}
	}

	handleValueChange(e) {
		const x = Number(e.target.value);

		if (isNaN(x) || x < 1 || x > this.state.max_qty) {
			this.setState({ error: "Input not valid" });
		} else {
			this.setState({ 
				restock_qty: x,
				error: "Quantity updated" 
			});
		}
		console.log(x);
	}

	render() {
		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">

							<div className="row col-12 justify-content-center mb-4">
								<h1 className="text-center text-uppercase display-3">Confirm/Edit the restocked quantity</h1>
							</div>

							<div className="row col-12">
								<div className="col-5 d-flex flex-column justify-content-center">
									<div className="p-2 align-self-center">
										<img src="http://localhost:3000/assets/images/cola.jpg" className="img-thumbnail border-0" alt="product" />
									</div>
								</div>

								<div className="row col-7">
									<div className="row col-12 d-flex flex-column justify-content-center mb-5">
										<div className="p-2 align-self-center col-10">
											<label className="lead text-uppercase custom-t1">Slot</label><br/>
											<select className="form-control border border-dark border-3 form-control-lg font-weight-bold custom-t1" aria-label="Select product ...">
												<option value="Ford">1</option>
												<option value="Volvo">3</option>
												<option value="Fiat">8</option>
											</select>
										</div>
									</div>

									<div className="row col-12 d-flex flex-column justify-content-center mb-5">
										<div className="p-2 align-self-center col-10">
											<label className="lead text-uppercase custom-t1">Quantity</label><br/>
											<div className="form-inline">
												<input type="button" value="-" className="form-control col-2 btn border border-dark border-3 form-control-lg font-weight-bold custom-t1" onClick={this.handleMinus}></input>
												<input type="number" value={this.state.restock_qty} className="form-control col-8 border border-dark border-3 form-control-lg font-weight-bold custom-t1" onChange={this.handleValueChange}></input>
												<input type="button" value="+" className="form-control col-2 btn border border-dark border-3  form-control-lg font-weight-bold custom-t1" onClick={this.handlePlus}></input>
											</div>
										</div>
									</div>

									<div className="row col-12 d-flex justify-content-center mt-5">
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
				</div>
			</>
		);
	}
}

export default ManualTopup;