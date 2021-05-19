import React from "react";
import { Link } from 'react-router-dom';
import '../../App.css';

class AutoTopup extends React.Component {

	constructor(props) {
		super(props);
	
		this.state = { 
			currentStocks: {},
			stocks: {},
			slots: {},
			// products: {},
			restockQty: 0,
			stockId: 0,
			productURL: "/assets/images/cola.jpg",
			productName: "Coca Cola",
			maxQty: 12,
			error: null,
			restockData: {},
			layoutDetail: {},
			templateDetail: {}
		};

		this.handlePlus = this.handlePlus.bind(this);
		this.handleMinus = this.handleMinus.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleBtnSlotOnClick = this.handleBtnSlotOnClick.bind(this);
		this.handleBtnMainConfirmOnClick = this.handleBtnMainConfirmOnClick.bind(this);
		this.handleBtnSubConfirmOnClick = this.handleBtnSubConfirmOnClick.bind(this);
	}

	componentDidMount = () => {
		const url = "/stock/topup"; 

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				this.setState({
					currentStocks: response.current_stocks,
					stocks: response.stocks,
					slots: response.slots,
					// products: response.products,
					restockData: response.current_stocks,
					layoutDetail: response.layout_detail,
					templateDetail: response.template_detail
				});
			})
			.catch(() => this.props.history.push("/management"));
	}

	handlePlus = () => {
		if (this.state.restockQty < this.state.maxQty) {
			this.setState({ restockQty: parseInt(this.state.restockQty) + 1 });
		} else {
			this.setState({ error: "No stock" });
		}
	}

	handleMinus = () => {
		if (this.state.restockQty > 0) {
			this.setState({ restockQty: parseInt(this.state.restockQty) - 1 });
		} else {
			this.setState({ error: "No items" });
		}
	}

	handleValueChange = (event) => {
		const x = Number(event.target.value);

		if (isNaN(x) || x < 1 || x > this.state.maxQty) {
			this.setState({ error: "Input not valid" });
		} else {
			this.setState({ 
				restockQty: x,
				error: "Quantity updated" 
			});
		}
	}

	handleBtnSlotOnClick = (event) => {
		event.preventDefault();
		const stockId = event.target.getAttribute("data-stockid");

		const stocks = this.state.stocks;
		// const products = this.state.products;

		let getProductId = 0;
		if (stocks.length < 0 ) {
			stocks.forEach( stock => {
				if (stock.id === parseInt(stockId)) {
					getProductId = stock.product_id;
				}
			});
		}

		// products.forEach( product => {
		// 	if (product.id === parseInt(getProductId)) {
		// 		this.setState({ 
		// 			productName: product.name,
		// 			productURL: product.image_url,
		// 		});
		// 	}
		// });

		this.setState({ 
			restockQty: event.target.getAttribute("data-restockqty"),
			stockId: event.target.getAttribute("data-stockid")
		});

		document.getElementById("open-modal").click();
	} 

	handleBtnSubConfirmOnClick = (event) => {
		const stockId = this.state.stockId;
		const restockQty = this.state.restockQty;
		const currentStocks = this.state.currentStocks;
		
		let preparedData = [];

		currentStocks.forEach(element => {
			if (element.stock_id === parseInt(stockId)) {
				preparedData.push({stock_id: element.stock_id, stock_qty: restockQty});
			} else {
				preparedData.push({stock_id: element.stock_id, stock_qty: element.stock_qty});
			}
		});

		this.setState({ restockData: preparedData });

		document.getElementById("close-modal").click();
	}

	handleBtnMainConfirmOnClick = (event) => {
		const url = "/stock/restock";

		let preparedData = [];
		const restockData = this.state.restockData;

		restockData.forEach(element => {
			preparedData.push({stock_id: element.stock_id, stock_qty: element.stock_qty});
		});

		const body = {
			restock: preparedData.slice(0, 1)
		};
		
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		fetch(url, {
			method: 'POST',
			headers: myHeaders,
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
		const stocks = this.state.stocks;
		const slots = this.state.slots;
		const layoutDetail = this.state.layoutDetail;
		const templateDetail = this.state.templateDetail;
		// const maxQty = this.state.maxQty;
		let slotData = [];

		Object.values(layoutDetail).forEach((lDetail) => {
			// Object.values(templateDetail).forEach((tDetail) => {
				// if (tDetail.layout_detail_id === lDetail.id) {
					Object.values(slots).forEach((slot) => {
						if (lDetail.slot_id === slot.id) {
							if (stocks.length !== 0) {
								Object.values(stocks).forEach((stock) => {
									if (slot.id === stock.slot_id) {
										slotData.push({layout_detail_id: lDetail.id, slot_id: slot.id, stock_id: stock.id, stock_qty: stock.stock_qty, is_active: lDetail.is_active, product_id: slot.product_id});
									}
								});
							} else {
								let data = {
									layout_detail_id: lDetail.id, 
									slot_id: slot.id, 
									stock_id: 0, 
									stock_qty: 0, 
									is_active: lDetail.is_active, 
									product_id: slot.product_id
								}
								slotData.push(data);
							}
						}
					});
				// }
			// });
		});

		let slotList = [];
		Object.values(slotData).forEach((data) => {
			console.log(data)
			slotList.push(<div key={data.slot_id} id={'cs_' + data.slot_id} onClick={this.handleBtnSlotOnClick} className="col align-self-center text-center border border-dark border-3 bg-slot btn-slot" data-restockqty={data.stock_qty} data-stockid={data.stock_id}><h2 className="text-uppercase display-4 mt-3 mb-3" data-restockqty={data.stock_qty} data-stockid={data.stock_id}>{data.stock_qty}/12</h2></div>);
		});
		// Object.entries(slots).forEach((slot, index) => {
		// 	if (stocks.length !== 0) {
		// 		Object.entries(stocks).forEach((stock, index) => {
		// 			slotList.push(<div key={index} id={'cs_' + index} onClick={this.handleBtnSlotOnClick} className="col align-self-center text-center border border-dark border-3 bg-slot btn-slot" data-restockqty={stock[1].stock_qty} data-stockid={stock[1].id}><h2 className="text-uppercase display-4 mt-3 mb-3" data-restockqty={stock[1].stock_qty} data-stockid={stock[1].id}>{stock[1].stock_qty}/{maxQty}</h2></div>);
		// 		});
		// 	} else {
		// 		slotList.push(<div key={index} id={'cs_' + index} onClick={this.handleBtnSlotOnClick} className="col align-self-center text-center border border-dark border-3 bg-slot btn-slot" data-restockqty={0} data-stockid={slot[1].id}><h2 className="text-uppercase display-4 mt-3 mb-3" data-restockqty={0} data-stockid={slot[1].id}>{0}/{maxQty}</h2></div>);
		// 	}
		// });

		// console.log(slotList)

		let level1_slotList, level2_slotList, level3_slotList, level4_slotList, level5_slotList, level6_slotList = [];

		level1_slotList = slotList.slice(0, 9);
		level2_slotList = slotList.slice(10, 19);
		level3_slotList = slotList.slice(20, 29);
		level4_slotList = slotList.slice(0, 9);
		level5_slotList = slotList.slice(10, 19);
		level6_slotList = slotList.slice(20, 29);

		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center text-uppercase">
					<div className="container-fluid">
						<div className="m-3">

							<div className="row col-12 justify-content-center mb-4">
								<h1 className="text-center text-uppercase display-4">Confirm the restocked quantity for each slot</h1>
							</div>

							<div className="row justify-content-center">
								{level1_slotList}
							</div>

							<div className="row justify-content-center">
								{level2_slotList}
							</div>

							<div className="row justify-content-center">
								{level3_slotList}
							</div>

							<div className="row justify-content-center">
								{level4_slotList}
							</div>

							<div className="row justify-content-center">
								{level5_slotList}
							</div>

							<div className="row justify-content-center">
								{level6_slotList}
							</div>

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
													<input type="number" value={this.state.restockQty} className="form-control col-8 border border-dark border-3 form-control-lg font-weight-bold custom-t2" onChange={this.handleValueChange}></input>
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