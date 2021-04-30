import React from "react";
import { Link } from 'react-router-dom';
import '../../App.css';

class AutoTopup extends React.Component {

	// constructor (props) {
	// 	super(props);
	// 	this.state = { restock_data: {} }
	// }

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
		let slots=['Slot 1','Slot 2','Slot 3','Slot 4','Slot 5', 'Slot 6', 'Slot 7', 'Slot 8', 'Slot 9', 'Slot 10'];
		let slotList=[];
		slots.forEach((slot,index)=>{
			slotList.push( <div key={index} data-toggle="modal" data-target="#myModal" id={'slt_' + index} className="col align-self-center text-center border border-dark border-3 bg-slot"><h2 className="text-uppercase display-4 mt-3 mb-3">{index+1}/12</h2></div>);
		});

		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center text-uppercase">
					<div className="container-fluid">
						<div className="m-3">

							<div className="row col-12 justify-content-center mb-4">
								<h1 className="text-center text-uppercase display-4">Confirm the restocked quantity for each slot</h1>
							</div>

							<div className="row justify-content-center">
								{slotList}
							</div>

							<div className="row justify-content-center">
								{slotList}
							</div>

							<div className="row justify-content-center">
								{slotList}
							</div>

							<div className="row justify-content-center">
								{slotList}
							</div>

							<div className="row justify-content-center">
								{slotList}
							</div>

							<div className="row justify-content-center">
								{slotList}
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

				<div id="myModal" className="modal text-uppercase" tabIndex="-1" role="dialog">
					<div className="modal-dialog modal-xl modal-en" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title display-4">Confirm Restocked Quantity</h4>
								<button type="button" className="close custom-t1" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="row col-12">
									<div className="col-4 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center">
											<img src="http://localhost:3000/assets/images/cola.jpg" className="img-thumbnail border-0" alt="product" />
										</div>
									</div>

									<div className="row col-8">
										<div className="row col-12 d-flex flex-column justify-content-center">
											<div className="p-2 align-self-center">
												<h1 className="lead text-uppercase custom-t2">Quantity</h1><br/>
												<div className="form-inline">
													<input type="button" value="-" className="form-control col-2 btn border border-dark border-3 form-control-lg font-weight-bold custom-t2" onClick={this.handleMinus}></input>
													<input type="number" value={this.state.restock_qty} className="form-control col-8 border border-dark border-3 form-control-lg font-weight-bold custom-t2" onChange={this.handleValueChange}></input>
													<input type="button" value="+" className="form-control col-2 btn  border border-dark border-3  form-control-lg font-weight-bold custom-t2" onClick={this.handlePlus}></input>
												</div>
											</div>
										</div>
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
								<Link to="/management" className="btn btn-lg btn-info">
										<h2 className="text-center text-uppercase custom-t2">Confirm</h2>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default AutoTopup;