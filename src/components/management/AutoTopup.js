import {useState, useEffect} from "react";
import SERVER_REQ from '../../helpers/Request';
import { Link } from 'react-router-dom';
import '../../App.css';
import imgURL from '../../assets/static_images/no_image.png';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';

const AutoTopup = (props) => {
	const [slotData, setSlotData] = useState([]);
	const [modifiedSlotData, setModifiedSlotData] = useState([]);
	const [rawSlotData, setRawSlotData] = useState([]);
	const [productURL, setProductURL] = useState(imgURL);
	const [productName, setProductName] = useState("");
	const [toStockQty, setToStockQty] = useState(0);
	const [slotId, setSlotId] = useState(0);
	const [maxQty, setMaxQty] = useState(0);
	const [toStockData] = useState([]);
	const [showModal, setShowModal] = useState(false);

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

				setSlotData(slotList);
				setRawSlotData(rawSlots);
			})
			.catch(error => console.log(error.message));
	}, [modifiedSlotData]);

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

	const handleBtnSlotOnClick = (event) => {
		event.preventDefault();
		let slotId = event.target.getAttribute("data-slotid");
		rawSlotData.forEach((data, index) => {
			if (parseInt(data.slot_id) === parseInt(slotId)) {
				setToStockQty(data.to_stock);
				setSlotId(slotId);
				setMaxQty(data.max_qty);
				setProductURL(data.image);
				setProductName(data.product_name);
				setShowModal(true);
			}
		});
	} 

	const handleBtnSubConfirmOnClick = (event) => {
		slotData.forEach((rowData, i) => {
			rowData.forEach((slot, j) => {
				if (parseInt(slotId) === parseInt(slot.slot_id)) {
					slot.to_stock = toStockQty;
				}
			});
		});
		
		setModifiedSlotData(slotData);
		setShowModal(false);
		toStockData.push({slot_id: slotId, tostock_qty: toStockQty});
	}

	const handleBtnMainConfirmOnClick = async(event) => {
		let preparedData = {};
		let preparedDataIndex =0;

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
			props.history.push("/management")
		}
	}

	const handleModalClose = () => {
		setShowModal(false);
	}

	return (
		<Container fluid className="text-uppercase">
			<Row className="justify-content-center">
				<p className="text-center custom-t2">Confirm the restocked quantity for slots</p>
			</Row>
			{
				(modifiedSlotData.length === 0) ? 
					slotData.map((rowData, index) => (
						<Row key={index} className="justify-content-center">
							{
								rowData.map(data => (<Col lg="1" key={data.slot_id} id={'cs_' + data.slot_id} onDoubleClick={handleBtnSlotOnClick} className={data.tied ? "col align-self-center text-center border border-1 bg-slot btn-slot" : "col align-self-center text-center border border-1 bg-slot btn-slot disable-div"} data-slotid={data.slot_id} ><p className="custom-t3 mt-1 mb-1 ml-2 mr-2" data-slotid={data.slot_id} >{data.to_stock ? data.to_stock + "/" + data.max_qty : "-"}</p></Col>))
							}
						</Row>
					)) : modifiedSlotData.map((rowData, index) => (
						<Row key={index} className="justify-content-center">
							{
								rowData.map(data => (<Col lg="1" key={data.slot_id} id={'cs_' + data.slot_id} onDoubleClick={handleBtnSlotOnClick} className={data.tied ? "col align-self-center text-center border border-1 bg-slot btn-slot" : "col align-self-center text-center border border-1 bg-slot btn-slot disable-div"} data-slotid={data.slot_id} ><p className="custom-t3 mt-1 mb-1 ml-2 mr-2" data-slotid={data.slot_id} >{data.to_stock ? data.to_stock + "/" + data.max_qty : "-"}</p></Col>))
							}
						</Row>
					))
			}
			<Row className="justify-content-center mt-4">
				<div className="text-center col p-2 align-self-center">
					<Link to="/management" className="btn btn-lg btn-warning">
						<h2 className="text-center text-uppercase display-4">Cancel</h2>
					</Link>
				</div>

				<div className="text-center col p-2 align-self-center">
					<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold" onClick={handleBtnMainConfirmOnClick}>
						<h2 className="text-center text-uppercase display-4">Confirm</h2>
					</button>
				</div>
			</Row>

			<Modal show={showModal} size="xl" centered>
				<Modal.Header>
					<Modal.Title className="custom-t2 text-uppercase">
						Confirm Restocked Quantity
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="justify-content-center">
						<Col lg={5} className="text-center">
							<div className="p-1 align-self-center">
								<img src={`http://vending.smartvending.com${productURL}`} className="img-thumbnail border-0" alt={productName} />
								<h1 className="text-center text-uppercase custom-t3">{productName}</h1>
							</div>
						</Col>

						<Col lg={7} className="align-self-center text-uppercase custom-t2">
							<Row>
								<label className="text-uppercase custom-t2">Quantity</label><br/>
								<Col lg={2} className="p-0">
									<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t2" onClick={handleMinus} />
								</Col>
								<Col lg={6} className="p-0">
									<input type="number" value={toStockQty} className="form-control border border-1 form-control-lg custom-t2" onChange={handleValueChange} readOnly={true} />
								</Col>
								<Col lg={2} className="p-0">
									<input type="button" value="+" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t2" onClick={handlePlus} />
								</Col>
							</Row>
						</Col>

					</Row>
				</Modal.Body>
				<Modal.Footer className="text-center">
					<div className="text-center">
						<Button variant="warning" type="button" className="text-uppercase" onClick={handleModalClose}>
							<h2 className="text-center text-uppercase custom-t3">Cancel</h2>
						</Button>
					</div>

					<div className="text-center">
						<Button variant="info" type="button" className="text-uppercase" onClick={handleBtnSubConfirmOnClick}>
							<h2 className="text-center text-uppercase custom-t3">Confirm</h2>
						</Button>
					</div>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}

export default AutoTopup;