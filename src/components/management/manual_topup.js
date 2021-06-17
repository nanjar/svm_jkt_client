import React from "react";
import SERVER_REQ from '../../helpers/Request';
import { Link } from 'react-router-dom';
import '../../App.css';
import { Container, Row, Col, InputGroup } from 'react-bootstrap';
import NumPad from 'react-numpad';

class ManualTopup extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			slotData: {},
			productURL: "",
			productName: "",
			productId: false,
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
		const url = "http://vending.smartvending.com/api/topups/layouts.json"; 

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

	handleSlotOnChange = (event) => {
		const slotData = this.state.slotData;

		slotData.forEach(slot => {
			this.setState({ toStockQty: 0 });
			console.log(parseInt(event), slot.slot_id)
			if (Number(event) === slot.slot_id) {
				this.setState({ 
					toStockQty: slot.to_stock,
					productId: slot.product_id,
					productURL: slot.image,
					productName: slot.product_name
				});
			} 
		});
		
		this.setState({slotId: event});	
	}

	handleBtnConfirmOnClick = async() => {
		const {slotId, toStockQty, productId} = this.state;
		const button_post = await SERVER_REQ.post(`http://vending.smartvending.com/api/stocks.json`, {'slot_id': slotId, 'to_stock': toStockQty, 'product_id': productId});
		console.log(button_post);
		if (button_post.response.success) {
			this.props.history.push("/management")
		}
	}

	render() {
		const {slotData, slotId, productName, productURL} = this.state;
		
		// const limitValidator = (value) => parseInt(value, 10) > -1 && parseInt(value, 10) <= 60;
		
		let slotList = [];
		Object.values(slotData).forEach((slot) => {
			slotList.push(<option key={slot.slot_id} value={slot.product_id}>{slot.slot_id}</option>);
		});

		return (
			<Container>
				<Row className="justify-content-center">
					<h1 className="text-center text-uppercase display-3">Confirm/Edit the restocked quantity</h1>
				</Row>

				<Row className="justify-content-center mt-5 mb-5">
					<Col lg={5} className="text-center">
						<div className="p-2 align-self-center">
							<img src={`http://vending.smartvending.com${productURL}`} className="img-thumbnail border-0" alt={productName} />
							<h1 className="text-center text-uppercase custom-t2">{productName}</h1>
						</div>
					</Col>

					<Col lg={7} className="align-self-center text-uppercase custom-t2">
						<label className="text-uppercase custom-t2">Slot</label><br/>
						<NumPad.Number
							decimal={false}
							negative={false}
							onChange={this.handleSlotOnChange}
							placeholder={'TYPE THE SLOT'}
							value={slotId} />

						<br />
						<br />

						<label className="text-uppercase custom-t2">Quantity</label><br/>
						<InputGroup>
							<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={this.handleMinus}></input>
							<input type="number" value={this.state.toStockQty} className="form-control border border-1 form-control-lg custom-t1" onChange={this.handleValueChange} readOnly={true}></input>
							<input type="button" value="+" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={this.handlePlus}></input>
						</InputGroup>
					</Col>
				</Row>

				<Row>
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
				</Row>
			</Container>
		);
	}
}

export default ManualTopup;