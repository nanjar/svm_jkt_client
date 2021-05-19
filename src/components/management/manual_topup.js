import React from "react";
import { Link } from 'react-router-dom';
import '../../App.css';
import productImg from '../../assets/static_images/button.gif';

class ManualTopup extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			currentStocks: {},
			stocks: {},
			slots: {},
			products: {},
			restockQty: 0,
			stockId: 0,
			productURL: productImg,
			productName: "",
			maxQty: 12,
			error: null,
			restockData: {}
		};

		this.handlePlus = this.handlePlus.bind(this);
		this.handleMinus = this.handleMinus.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
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
					products: response.products,
					restockData: response.current_stocks
				});
			})
			.catch(() => this.props.history.push("/management"));
	}

	handlePlus = () => {
		if (this.state.restockQty < this.state.maxQty) {
			this.setState({ restockQty: this.state.restockQty + 1 });
		} else {
			this.setState({ error: "No stock" });
		}
	}

	handleMinus = () => {
		if (this.state.restockQty > 0) {
			this.setState({ restockQty: this.state.restockQty - 1 });
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

	handleOptionChange = (event) => {
		const getProductId = event.target.value;
		const products = this.state.products;
		const stocks = this.state.stocks;
		const currentStocks = this.state.currentStocks;

		if (getProductId !== "default") {
			products.forEach(product => {
				if (product.id === parseInt(getProductId)) {
					this.setState({ 
						productName: product.name,
						productURL: product.image_url,
					});

					stocks.forEach(stock => {
						if (stock.product_id === parseInt(getProductId)) {
							currentStocks.forEach(currentStock => {
								if (currentStock.stock_id === stock.id) {
									this.setState({ 
										stockId: stock.id,
										restockQty: currentStock.stock_qty 
									});
								}
							});
						}
					});
				}
			});
		} else {
			this.setState({ 
				productName: "Choose the slot ...",
				productURL: productImg,
				restockQty: 0
			});
		}
	}

	handleBtnConfirmOnClick = (event) => {
		const url = "/stock/restock";

		let preparedData = [];
		const restockData = this.state.restockData;

		restockData.forEach(element => {
			preparedData.push({stock_id: element.stock_id, stock_qty: element.stock_qty});
		});

		const body = {
			restock: [{
				stock_id: this.state.stockId,
				stock_qty: this.state.restockQty
			}]
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
		
		let stockList = [];
		Object.entries(stocks).forEach((stock, index) => {
			stockList.push(<option key={index} value={stock[1].product_id}>{stock[1].slot_id}</option>);
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
										<div className="p-2 align-self-center col-10">
											<label className="lead text-uppercase custom-t1">Slot</label><br/>
											<select className="form-control border border-dark border-3 form-control-lg custom-t1" aria-label="Select product ..." onChange={this.handleOptionChange}>
												<option value="default">Choose the slot ...</option>
												{stockList}
											</select>
										</div>
									</div>

									<div className="row col-12 d-flex flex-column justify-content-center mb-5">
										<div className="p-2 align-self-center col-10">
											<label className="lead text-uppercase custom-t1">Quantity</label><br/>
											<div className="form-inline">
												<input type="button" value="-" className="form-control col-2 btn border border-dark border-3 form-control-lg font-weight-bold custom-t1" onClick={this.handleMinus}></input>
												<input type="number" value={this.state.restockQty} className="form-control col-8 border border-dark border-3 form-control-lg custom-t1" onChange={this.handleValueChange}></input>
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