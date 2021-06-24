import {useState, useEffect} from "react";
import SERVER_REQ from '../../helpers/Request';
import { Link } from 'react-router-dom';
import '../../App.css';
import imgURL from '../../assets/static_images/no_image.png';
import { Container, Row, Col, Modal } from 'react-bootstrap';

const ManualTopup = (props) => {
	const [slotData, setSlotData] = useState({});
	const [productURL, setProductURL] = useState(imgURL);
	const [productName, setProductName] = useState("");
	const [productId, setProductId] = useState(false);
	const [toStockQty, setToStockQty] = useState(0);
	const [maxQty] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [slotId, setSlotId] = useState("");
	const [showNumpad, setShowNumpad] = useState(false);
	const [numInput, setNumInput] = useState("");
	const [contentMsg, setContentMsg] = useState("");

	useEffect(() => {
		const url = "http://vending.smartvending.com/api/topups/layouts.json"; 

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				setSlotData(response.data);
			})
			.catch(error => console.log(error.message));
	}, [slotId, numInput]);

	const handlePlus = () => {
		if (parseInt(toStockQty) < ((parseInt(maxQty) === 0) ? 12 : parseInt(maxQty))) {
			setToStockQty(parseInt(toStockQty) + 1);
		} 
	}

	const handleMinus = () => {
		if (parseInt(toStockQty) > 0) {
			setToStockQty(parseInt(toStockQty) - 1);
		}
	}

	const handleValueChange = (event) => {
		const x = Number(event.target.value);
		setToStockQty(x);
	}

	// show alert if slot is inactive else set the data to send 
	const handleSlotId = () => {
		console.log("num " + numInput);
		console.log("slot " + slotId);
		const uniqSlotId = slotData.map(x => x['slot_id']);

		console.log(uniqSlotId);
		if (uniqSlotId.includes(parseInt(slotId))) {
			slotData.forEach(slot => {
				setToStockQty(0);
				console.log(parseInt(slotId), slot.slot_id);
				if (parseInt(slotId) === slot.slot_id) {
					setToStockQty(slot.to_stock);
					setProductId(slot.product_id);
					setProductURL(`http://vending.smartvending.com${slot.image}`);
					setProductName(slot.product_name);
				} 
			});
		} else {
			let msg = (parseInt(slotId) > 60) ? "Invalid slot! Please key in the valid slot number." : "Slot " + slotId + " is inactive. Please key in the active slot number";
			setShowModal(true);
			setContentMsg(msg);
		}
	}

	const handleBtnConfirmOnClick = async() => {
		if (slotId === "" || toStockQty === 0) {
			let msg = "Please key in the slot number and set the amount.";
			setShowModal(true);
			setContentMsg(msg);
		} else {
			const button_post = await SERVER_REQ.post(`http://vending.smartvending.com/api/stocks.json`, {'slot_id': slotId, 'to_stock': toStockQty, 'product_id': productId});
			console.log(button_post);
			if (button_post.response.success) {
				props.history.push("/management")
			}
		}
		
		
	}

	const handleButtonOk = () => {
		setShowModal(false);
		setNumInput("");
		setSlotId("");
		setProductURL(imgURL);
		setProductName("");
	}

	const handleShowNumpad = () => {
		setShowNumpad(true);
		setNumInput("");
		if (showNumpad) {handleSlotId();}
	}

	const handleHideNumpad = () => {
		setShowNumpad(false);
		setNumInput("");
	}

	const handleNumInput = (event) => {
		let num = event.target.getAttribute("data-num");
		if(num !== "Set" || num !== "Del") { setNumInput(num); }
		let oldNum = numInput;
		if (num === "Set") {
			console.log(numInput);
			if (numInput === "") {
				setShowNumpad(false);
				setProductURL(imgURL);
				setProductName("");
			} else {
				setShowNumpad(false);
				handleSlotId();
			}
		} else if ( num === "Del") {
			setNumInput(oldNum.slice(0, -1));
			setSlotId(oldNum.slice(0, -1));
		} else {
			if (oldNum.charAt(0) === "0") {
				let newNum = oldNum + num;
				while(newNum.charAt(0) === '0')
				{
					newNum = newNum.substring(1);
				}
				setNumInput(newNum);
				setSlotId(newNum);
			} else {
				setNumInput(oldNum + num);
				setSlotId(oldNum + num);
			}
		}
	}

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
							<input type="text" onClick={handleShowNumpad} value={slotId} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} placeholder="TYPE SLOT NUMBER" />
						</Col>
					</Row>

					<Row>
						<label className="text-uppercase custom-t2">Quantity</label><br/>
						<Col lg={2} className="p-0">
							<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={handleMinus} />
						</Col>
						<Col lg={6} className="p-0">
							<input type="number" value={toStockQty} className="form-control border border-1 form-control-lg custom-t1" onChange={handleValueChange} readOnly={true} />
						</Col>
						<Col lg={2} className="p-0">
							<input type="button" value="+" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={handlePlus} />
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
					<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold" onClick={handleBtnConfirmOnClick}>
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
						<button type="button" onClick={handleButtonOk} className="btn btn-lg btn-info text-uppercase font-weight-bold ">
							<h2 className="text-center text-uppercase custom-t2">Ok</h2>
						</button>
					</div>
				</Modal.Footer>
			</Modal>

			<Modal show={showNumpad} size="md" centered className="text-uppercase">
				<label className="custom-t2" style={{paddingLeft: "90%", cursor: "pointer"}} onClick={handleHideNumpad}>&times;</label>
				<Modal.Body className="m-3 mt-0">
					<Row>
						<input type="text" value={numInput} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} />
					</Row>
					{
						numData.map((rowData, rowIndex) => (
							<Row key={'row-' + rowIndex} className="justify-content-center">
								{
									rowData.map((num, index) => (
										<Col key={index} onClick={handleNumInput} className="col align-self-center text-center border border-1 bg-slot btn-slot" data-num={num}><p data-num={num} className="custom-t3 mt-3 mb-3" >{num}</p></Col>
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

export default ManualTopup;