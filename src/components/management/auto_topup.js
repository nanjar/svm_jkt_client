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
			products: {},
			restockQty: 0,
			productURL: "",
			productName: "",
			max_qty: 12,
			error: null,
		};

		this.handlePlus = this.handlePlus.bind(this);
		this.handleMinus = this.handleMinus.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleBtnSlotOnClick = this.handleBtnSlotOnClick.bind(this);
	}

	componentDidMount() {
		const url = "/stock/auto_topup"; 

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
					products: response.products
				});
			})
			.catch(() => this.props.history.push("/management"));

		this.handlePlus = this.handlePlus.bind(this);
		this.handleMinus = this.handleMinus.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
	}

	handlePlus = () => {
		if (this.state.restockQty < this.state.max_qty) {
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

		if (isNaN(x) || x < 1 || x > this.state.max_qty) {
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
		const products = this.state.products;

		let getProductId = 0;
		Object.entries(stocks).forEach((stock, index) => {
			if (stock[1].id === parseInt(stockId)) {
				getProductId = stock[1].product_id;
			}
		});

		Object.entries(products).forEach((product, index)=>{
			if (product[1].id === parseInt(getProductId)) {
				this.setState({ 
					productName: product[1].name,
					productURL: product[1].image_url
				});
			}
		});

		this.setState({ restockQty: event.target.getAttribute("data-restockqty") });
		document.getElementById("open-modal").click();
	} 

	render() {
		const currentStocks = this.state.currentStocks;

		let currentStockList=[];
		Object.entries(currentStocks).forEach((currentStock, index) => {
			currentStockList.push(<div key={index} id={'cs_' + index} onClick={this.handleBtnSlotOnClick} className="col align-self-center text-center border border-dark border-3 bg-slot btn-slot" data-restockqty={currentStock[1].stock_qty} data-stockid={currentStock[1].stock_id}><h2 className="text-uppercase display-4 mt-3 mb-3" data-restockqty={currentStock[1].stock_qty} data-stockid={currentStock[1].stock_id}>{currentStock[1].stock_qty}/12</h2></div>);
		});

		let level1_currentStockList, level2_currentStockList, level3_currentStockList, level4_currentStockList, level5_currentStockList, level6_currentStockList = []

		level1_currentStockList = currentStockList.slice(0, 9);
		level2_currentStockList = currentStockList.slice(10, 19);
		level3_currentStockList = currentStockList.slice(20, 29);
		level4_currentStockList = currentStockList.slice(0, 9);
		level5_currentStockList = currentStockList.slice(10, 19);
		level6_currentStockList = currentStockList.slice(20, 29);

		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center text-uppercase">
					<div className="container-fluid">
						<div className="m-3">

							<div className="row col-12 justify-content-center mb-4">
								<h1 className="text-center text-uppercase display-4">Confirm the restocked quantity for each slot</h1>
							</div>

							<div className="row justify-content-center">
								{level1_currentStockList}
							</div>

							<div className="row justify-content-center">
								{level2_currentStockList}
							</div>

							<div className="row justify-content-center">
								{level3_currentStockList}
							</div>

							<div className="row justify-content-center">
								{level4_currentStockList}
							</div>

							<div className="row justify-content-center">
								{level5_currentStockList}
							</div>

							<div className="row justify-content-center">
								{level6_currentStockList}
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
									<button type="button" className="btn btn-lg btn-warning text-uppercase font-weight-bold" data-dismiss="modal">
										<h2 className="text-center text-uppercase custom-t2">Cancel</h2>
									</button>
								</div>

								<div className="text-center">
									<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold">
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