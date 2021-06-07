import React from "react";
import { Link } from 'react-router-dom';
import '../../App.css';
import NumPad from 'react-numpad';
// import responseData from '../response_data';

class ManualTopup extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			slotData: {},
			productURL: "/assets/images/cola.jpg",
			productName: "Coca Cola",
			toStockQty: 0,
			stockId: 0,
			maxQty: 0,
			toStockData: {}
		};

		this.handlePlus = this.handlePlus.bind(this);
		this.handleMinus = this.handleMinus.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
	}

	componentDidMount = () => {
		const url = "/api/topups/layouts.json"; 
		// const url = "http://vending.smartvending.com/api/topups/layouts.json"; 

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				this.setState({ slotData: response.data });
			})
			.catch(() => this.props.history.push("/management"));
		// this.setState({ slotData: responseData.data });
	}

	handlePlus = () => {
		const toStockQty = parseInt(this.state.toStockQty);
		const maxQty = (parseInt(this.state.maxQty) === 0) ? 12 : parseInt(this.state.maxQty);

		if (toStockQty < maxQty) {
			this.setState({ toStockQty: toStockQty + 1 });
		} 
	}

	handleMinus = () => {
		const toStockQty = parseInt(this.state.toStockQty);

		if (toStockQty > 0) {
			this.setState({ toStockQty: toStockQty - 1 });
		}
	}

	handleValueChange = (event) => {
		const x = Number(event.target.value);
		this.setState({ toStockQty: x });
	}

	handleSlotOnChange = (event) => {
		const slotData = this.state.slotData;

		slotData.forEach(slot => {
			this.setState({ toStockQty: 0 });
			if (parseInt(event) === slot.slot_id) {
				this.setState({ toStockQty: slot.to_stock });
			} 
		});
		
		this.setState({slotId: event});	
	}

	handleBtnConfirmOnClick = (event) => {
		const url = "/api/stock/restock.json";

		const body = {
			slot_id: this.state.slotId, 
			to_stock: this.state.toStockQty
		};
		
		fetch(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'default',
			body: JSON.stringify(body)
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} 
			})
			.then(response => { this.props.history.push("/management") })
			.catch(error => console.log(error.message));
	}

	render() {
		const slotData = this.state.slotData;
		const slotId = this.state.slotId;

		// const limitValidator = (value) => parseInt(value, 10) > -1 && parseInt(value, 10) <= 60;
		
		let slotList = [];
		Object.values(slotData).forEach((slot) => {
			slotList.push(<option key={slot.slot_id} value={slot.product_id}>{slot.slot_id}</option>);
		});

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
										<img src={this.state.productURL} className="img-thumbnail border-0" alt="product" />
										<h1 className="text-center text-uppercase custom-t2">{this.state.productName}</h1>
									</div>
								</div>

								<div className="row col-7">
									<div className="row col-12 d-flex flex-column justify-content-center mb-5">
										<div id="manual-slot" className="align-self-center col-10 text-uppercase custom-t1">
											<NumPad.Number
												decimal={false}
												negative={false}
												onChange={this.handleSlotOnChange}
												label={'SLOT'}
												placeholder={'TYPE THE SLOT'}
												value={slotId}/>
										</div>
									</div>

									<div className="row col-12 d-flex flex-column justify-content-center mb-5">
										<div className="p-2 align-self-center col-10">
											<label className="text-uppercase custom-t1">Quantity</label><br/>
											<div className="form-inline">
												<input type="button" value="-" className="form-control col-2 btn border border-dark border-3 form-control-lg font-weight-bold custom-t1" onClick={this.handleMinus}></input>
												<input type="number" value={this.state.toStockQty} className="form-control col-8 border border-dark border-3 form-control-lg custom-t1" onChange={this.handleValueChange} readOnly={true}></input>
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
											<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold" onClick={this.handleBtnConfirmOnClick}>
												<h2 className="text-center text-uppercase display-4">Confirm</h2>
											</button>
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