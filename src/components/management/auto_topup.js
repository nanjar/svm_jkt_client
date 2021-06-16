import React from "react";
import { Link } from 'react-router-dom';
import '../../App.css';

class AutoTopup extends React.Component {
	constructor(props) {
		super(props);
	
		this.state = { 
			slotData: [],
			rawSlotData: [],
			productURL: "/assets/images/cola.jpg",
			productName: "Coca Cola",
			toStockQty: 0,
			modifiedToStockQty: 0,
			slotId: 0,
			maxQty: 0,
			toStockData: []
		};
	}

	componentDidMount = () => {
		const url = "http://vending.smartvending.com/api/topups/layouts.json"; 
		
		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				const rawSlots = response.data;
				let slotList = [];

				rawSlots.forEach(data => {
					if(!slotList[data.tied]) slotList[data.tied] = []; // for unhandle error at initialization
					slotList[data.tied].push(data);
				});

				slotList.forEach(data => {
					const len = 10 - data.length;
					let iter = 0;
					while(len > iter){
						slotList[data[0].tied].push({
							slot_id: Date.now().toString(36) + Math.random().toString(36).substring(2),
							max_qty: null,
							tied: null,
							product_id: null,
							image: null,
							product_name: null,
							current_stock: null,
							to_stock: null,
							slot_active: null
						})
						iter++;
					}
				});

				this.setState({ 
					slotData: slotList,
					rawSlotData: rawSlots
				});
			})
			.catch(error => console.log(error.message));
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

	handleBtnSlotOnClick = (event) => {
		event.preventDefault();
		const rawSlotData = this.state.rawSlotData;
		let slotId = event.target.getAttribute("data-slotid");
		rawSlotData.forEach((data, index) => {
			if (parseInt(data.slot_id) === parseInt(slotId)) {
				this.setState({ 
					toStockQty: data.to_stock,
					slotId: slotId,
					maxQty: data.max_qty,
					productURL: data.image,
					productName: data.product_name
				});
			}
		});
		
		document.getElementById("open-modal").click();
	} 

	handleBtnSubConfirmOnClick = (event) => {
		const slotId = this.state.slotId;
		const toStockQty = this.state.toStockQty;
		const slotData = this.state.slotData;

		slotData.forEach((rowData, i) => {
			rowData.forEach((slot, j) => {
				if (parseInt(slotId) === parseInt(slot.slot_id)) {
					slot.to_stock = toStockQty;
				}
			});
		});
		
		this.setState({slotData: slotData});
		this.state.toStockData.push({slot_id: slotId, tostock_qty: toStockQty});

		document.getElementById("close-modal").click();
	}

	handleBtnMainConfirmOnClick = (event) => {
		const url = "/api/topups/auto_topup.json";

		let preparedData = [];
		const slotData = this.state.slotData;
		const toStockData = this.state.toStockData;

		slotData.forEach(element => {
			let x, y;
			x = element.slot_id;
			y = element.to_stock;
			toStockData.forEach(tostock => {
				if (parseInt(tostock.slot_id) === parseInt(element.slot_id) && parseInt(tostock.tostock_qty) !== parseInt(element.slot_id)) {
					x = element.slot_id; 
					y = tostock.tostock_qty;
				}
			});
			preparedData.push({slot_id: x, to_stock: y});
		});

		console.log(preparedData);

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(preparedData)
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

		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center text-uppercase">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12 justify-content-center mb-4">
								<h1 className="text-center text-uppercase display-4">Confirm the restocked quantity for each slot</h1>
							</div>

							{
								slotData.map((rowData, index) => (
									<div key={index} className="row justify-content-center">
										{
											rowData.map(data => (<div key={data.slot_id} id={'cs_' + data.slot_id} onClick={this.handleBtnSlotOnClick} className={data.tied ? "col align-self-center text-center border border-dark border-3 bg-slot btn-slot" : "col align-self-center text-center border border-dark border-3 bg-slot btn-slot disable-div"} data-slotid={data.slot_id} ><h2 className="text-uppercase display-4 mt-3 mb-3" data-slotid={data.slot_id} >{data.to_stock ? data.to_stock + "/" + data.max_qty : "-"}</h2></div>))
										}
									</div>
								))
							}

							<div className="row col-12 d-flex justify-content-center mt-5">
								<div className="text-center col p-2 align-self-center">
									<Link to="/management" className="btn btn-lg btn-warning">
										<h2 className="text-center text-uppercase display-4">Cancel</h2>
									</Link>
								</div>

								<div className="text-center col p-2 align-self-center">
									<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold" onClick={this.handleBtnMainConfirmOnClick}>
										<h2 className="text-center text-uppercase display-4">Confirm</h2>
									</button>
								</div>
							</div>

						</div>
					</div>
				</div>

				<button id="open-modal" type="button" className="d-none"  data-toggle="modal" data-target="#myModal" data-dismiss="modal" aria-label="Close">Hidden Button</button>

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
											<img src={this.state.productURL} className="img-thumbnail border-0" alt="product" />
											<h1 className="text-center text-uppercase custom-t2">{this.state.productName}</h1>
										</div>
									</div>

									<div className="row col-8">
										<div className="row col-12 d-flex flex-column justify-content-center">
											<div className="p-2 align-self-center">
												<h1 className="lead text-uppercase custom-t2">Quantity</h1><br/>
												<div className="form-inline">
													<input type="button" value="-" className="form-control col-2 btn border border-dark border-3 form-control-lg font-weight-bold custom-t2" onClick={this.handleMinus}></input>
													<input type="number" value={this.state.toStockQty} className="form-control col-8 border border-dark border-3 form-control-lg font-weight-bold custom-t2" onChange={this.handleValueChange} readOnly={true}></input>
													<input type="button" value="+" className="form-control col-2 btn  border border-dark border-3 form-control-lg font-weight-bold custom-t2" onClick={this.handlePlus}></input>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer p-2">
								<div className="text-center">
									<button type="button" id="close-modal" className="btn btn-lg btn-warning text-uppercase font-weight-bold " data-dismiss="modal">
										<h2 className="text-center text-uppercase custom-t2">Cancel</h2>
									</button>
								</div>

								<div className="text-center">
									<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold" onClick={this.handleBtnSubConfirmOnClick}>
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

export default AutoTopup;