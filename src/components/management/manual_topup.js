import React from "react";
import SERVER_REQ from '../../helpers/Request';
import { Link } from 'react-router-dom';
import '../../App.css';
import imgURL from '../../assets/static_images/no_image.png';
import { Container, Row, Col, Modal } from 'react-bootstrap';

class ManualTopup extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			slotData: {},
			productURL: imgURL,
			productName: "",
			productId: false,
			toStockQty: 0,
			stockId: 0,
			maxQty: 0,
			toStockData: {},
			showModal: false,
			contentMsg: "",
			slotId: "",
			showNumpad: false,
			numInput: ""
		};

		this.handlePlus = this.handlePlus.bind(this);
		this.handleMinus = this.handleMinus.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleButtonOk = this.handleButtonOk.bind(this);
		this.handleShowNumpad = this.handleShowNumpad.bind(this);
		this.handleHideNumpad = this.handleHideNumpad.bind(this);
		this.handleNumInput = this.handleNumInput.bind(this);
		this.handleSlotId = this.handleSlotId.bind(this);
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

	handleSlotId = () => {
		console.log("hello");
		const {slotData, slotId} = this.state;
		const uniqSlotId = slotData.map(x => x['slot_id']);

		console.log(uniqSlotId);
		if (uniqSlotId.includes(parseInt(slotId))) {
			slotData.forEach(slot => {
				this.setState({ toStockQty: 0 });
				console.log(parseInt(slotId), slot.slot_id)
				if (parseInt(slotId) === slot.slot_id) {
					this.setState({ 
						toStockQty: slot.to_stock,
						productId: slot.product_id,
						productURL: `http://vending.smartvending.com${slot.image}`,
						productName: slot.product_name,
					});
				} 
			});
		} else {
			let msg = (parseInt(slotId) > 60) ? "Invalid slot! Please key in the valid slot number." : "Slot " + slotId + " is inactive. Please key in the active slot number";
			this.setState({
				showModal: true,
				contentMsg: msg,
			})
		}
	}

	handleBtnConfirmOnClick = async() => {
		const {slotId, toStockQty, productId} = this.state;
		const button_post = await SERVER_REQ.post(`http://vending.smartvending.com/api/stocks.json`, {'slot_id': slotId, 'to_stock': toStockQty, 'product_id': productId});
		console.log(button_post);
		if (button_post.response.success) {
			this.props.history.push("/management")
		}
	}

	handleButtonOk = () => {
		this.setState({ 
			showModal: false, 
			numInput: "",
			productURL: imgURL,
			productName: "" 
		});
	}

	handleShowNumpad = () => {
		this.setState({ 
			showNumpad: true, 
			numInput: "" 
		});
	}

	handleHideNumpad = () => {
		this.setState({ 
			showNumpad: false, 
			numInput: "" 
		});
	}

	handleNumInput = (event) => {
		let oldNum = this.state.numInput;
		let num = event.target.getAttribute("data-num");
		if (num === "Set") {
			if (oldNum === "") {
				this.setState({ 
					showNumpad: false,
					productURL: imgURL,
					productName: "" 
				});
			} else {
 				this.setState({
					slotId: this.state.numInput,
					showNumpad: false
				}, () => this.handleSlotId());
			}
		} else if ( num === "Del") {
			this.setState({ numInput: oldNum.slice(0, -1) });
		} else {
			if (oldNum.charAt(0) === "0") {
				let newNum = oldNum + num;
				while(newNum.charAt(0) === '0')
				{
					newNum = newNum.substring(1);
				}
				this.setState({ numInput: newNum });
			} else {
				this.setState({ numInput: oldNum + num });
			}
		}
	}

	render() {
		const {slotData, productName, productURL, showModal, contentMsg, showNumpad, numInput} = this.state;
		const numData = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['Del', '0', 'Set']];
		
		// const limitValidator = (value) => parseInt(value, 10) > -1 && parseInt(value, 10) <= 60;
		
		let slotList = [];
		Object.values(slotData).forEach((slot) => {
			slotList.push(<option key={slot.slot_id} value={slot.product_id}>{slot.slot_id}</option>);
		});

		return (
			<Container fluid>
				<Row className="justify-content-center mb-5">
					<h1 className="text-center text-uppercase display-3">Confirm/Edit the restocked quantity</h1>
				</Row>

				<Row className="justify-content-center mt-5 mb-5">
					<Col lg={5} className="text-center">
						<div className="p-2 align-self-center">
							<img src={productURL} className="img-thumbnail border-0" alt={productName} />
							<h1 className="text-center text-uppercase custom-t2">{productName}</h1>
						</div>
					</Col>

					<Col lg={7} className="align-self-center text-uppercase custom-t2">
						<Row className="mb-2">
							<label className="text-uppercase custom-t2">Slot</label><br/>
							<Col lg={10} className="p-0">
								<input type="text" onClick={this.handleShowNumpad} value={numInput} className="form-control border border-1 form-control-lg custom-t1" readOnly={true}></input>
							</Col>
							{/* <NumPad.Number
								decimal={false}
								negative={false}
								onChange={this.handleSlotOnChange}
								placeholder={'TYPE THE SLOT'}
								value={slotId} /> */}
						</Row>

						<Row>
							<label className="text-uppercase custom-t2">Quantity</label><br/>
							<Col lg={2} className="p-0">
								<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={this.handleMinus} />
							</Col>
							<Col lg={6} className="p-0">
								<input type="number" value={this.state.toStockQty} className="form-control border border-1 form-control-lg custom-t1" onChange={this.handleValueChange} readOnly={true} />
							</Col>
							<Col lg={2} className="p-0">
								<input type="button" value="+" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={this.handlePlus} />
							</Col>
						</Row>
					</Col>
				</Row>

				<Row className="mt-5">
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

				<Modal show={showModal} size="xl" centered>
					<Modal.Body>
						<p className="custom-t2 text-uppercase">{contentMsg}</p>
					</Modal.Body>
					<Modal.Footer className="text-center">
						<div className="text-center">
							<button type="button" onClick={this.handleButtonOk} className="btn btn-lg btn-info text-uppercase font-weight-bold ">
								<h2 className="text-center text-uppercase custom-t2">Ok</h2>
							</button>
						</div>
					</Modal.Footer>
				</Modal>

				<Modal show={showNumpad} size="md" centered className="text-uppercase">
					{/* <Modal.Header> */}
					<label className="custom-t2" style={{paddingLeft: "90%", cursor: "pointer"}} onClick={this.handleHideNumpad}>&times;</label>
					{/* </Modal.Header> */}
					<Modal.Body className="m-3 mt-0">
						<Row>
							<input type="text" value={numInput} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} />
						</Row>
						{
							numData.map((rowData, rowIndex) => (
								<Row key={'row-' + rowIndex} className="justify-content-center">
									{
										rowData.map((num, index) => (
											<Col key={index} onClick={this.handleNumInput} className="col align-self-center text-center border border-1 bg-slot btn-slot" data-num={num}><p data-num={num} className="custom-t3 mt-3 mb-3" >{num}</p></Col>
										))
									}	
								</Row>
							))
						}
					</Modal.Body>
				</Modal>
			</Container>
		);
	}
}

export default ManualTopup;