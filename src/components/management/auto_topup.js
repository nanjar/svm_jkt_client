import React from "react";
import SERVER_REQ from '../../helpers/Request';
import { Link } from 'react-router-dom';
import '../../App.css';
import { Container, Row, Col, InputGroup, Modal, Button } from 'react-bootstrap';

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
			toStockData: [],
			showModal: false
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
					productName: data.product_name,
					showModal: true
				});
			}
		});
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
		
		this.setState({
			slotData: slotData,
			showModal: false
		});
		this.state.toStockData.push({slot_id: slotId, tostock_qty: toStockQty});
	}

	handleBtnMainConfirmOnClick = async(event) => {
		let preparedData = {};
		let preparedDataIndex =0;
		const {slotData, toStockData} = this.state;

		slotData.forEach(data => {
			data.forEach(element => {
				let x, y, z;
				x = element.slot_id;
				y = element.to_stock;
				z = element.product_id;
				toStockData.forEach(tostock => {
					if (parseInt(tostock.slot_id) === parseInt(element.slot_id) && parseInt(tostock.tostock_qty) !== parseInt(element.slot_id)) {
						x = element.slot_id; 
						y = tostock.tostock_qty;
						z = element.product_id;
						preparedData[`stock[${preparedDataIndex}][slot_id]`] = x;
						preparedData[`stock[${preparedDataIndex}][to_stock]`] = y;
						preparedData[`stock[${preparedDataIndex}][product_id]`] = z;
						preparedDataIndex++;
					}
				});
			});
		});

		console.log(preparedData);
		const button_put = await SERVER_REQ.put(`http://vending.smartvending.com/api/stocks/1.json`, preparedData);
		console.log(button_put);
		if (button_put.response.success) {
			this.props.history.push("/management")
		}
	}

	handleModalClose = () => {
		this.setState({ showModal: false });
	}

	render() {
		const {slotData, productName, productURL, showModal} = this.state;

		return (
			<Container fluid className="m-3 text-uppercase">
				<Row className="justify-content-center">
					<p className="text-center custom-t2">Confirm the restocked quantity for each slot</p>
					<br />
				</Row>
				{
					slotData.map((rowData, index) => (
						<Row key={index} className="justify-content-center">
							{
								rowData.map(data => (<Col lg="1" key={data.slot_id} id={'cs_' + data.slot_id} onClick={this.handleBtnSlotOnClick} className={data.tied ? "col align-self-center text-center border border-1 bg-slot btn-slot" : "col align-self-center text-center border border-1 bg-slot btn-slot disable-div"} data-slotid={data.slot_id} ><p className="custom-t3 mt-3 mb-3" data-slotid={data.slot_id} >{data.to_stock ? data.to_stock + "/" + data.max_qty : "-"}</p></Col>))
							}
						</Row>
					))
				}
				<Row className="justify-content-center">
					<br />
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
				</Row>

				<Modal show={showModal} size="xl" centered>
					<Modal.Header>
						<Modal.Title className="custom-t2">
							Confirm Restocked Quantity
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row className="justify-content-center mt-5 mb-5">
							<Col lg={5} className="text-center">
								<div className="p-2 align-self-center">
									<img src={`http://vending.smartvending.com${productURL}`} className="img-thumbnail border-0" alt={productName} />
									<h1 className="text-center text-uppercase custom-t2">{productName}</h1>
								</div>
							</Col>

							<Col lg={7} className="align-self-center text-uppercase custom-t2">
								<label className="text-uppercase custom-t2">Quantity</label><br/>
								<InputGroup>
									<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={this.handleMinus}></input>
									<input type="number" value={this.state.toStockQty} className="form-control border border-1 form-control-lg custom-t1" onChange={this.handleValueChange} readOnly={true}></input>
									<input type="button" value="+" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={this.handlePlus}></input>
								</InputGroup>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer className="text-center">
						<div className="text-center">
							<Button variant="warning" type="button" className="text-uppercase" onClick={this.handleModalClose}>
								<h2 className="text-center text-uppercase custom-t2">Cancel</h2>
							</Button>
						</div>

						<div className="text-center">
							<Button variant="info" type="button" className="text-uppercase" onClick={this.handleBtnSubConfirmOnClick}>
								<h2 className="text-center text-uppercase custom-t2">Confirm</h2>
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</Container>
		);
	}
}

export default AutoTopup;