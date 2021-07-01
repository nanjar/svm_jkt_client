import {useState, useEffect} from "react";
import SERVER_REQ from '../../helpers/Request';
import FORMATTER from '../../helpers/Formatter';
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
	// const [showAlert, setShowAlert] = useState(false);
	const [maxNumRestock, setMaxNumRestock] = useState("");
	const [showSpan, setShowSpan] = useState("d-none");

	useEffect(() => {
		const url = `${FORMATTER.api_base_url()}/api/topups/layouts.json`; 
		
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
		if (parseInt(maxNumRestock) !== parseInt(maxQty)) {
			if (parseInt(toStockQty) < parseInt(maxNumRestock)) {
				setToStockQty(parseInt(toStockQty) + 1);
			} 
		} else {
			if (parseInt(toStockQty) <  parseInt(maxQty)) {
				setToStockQty(parseInt(toStockQty) + 1);
			} 
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
			console.log(parseInt(data.to_stock) === 0);
			if (parseInt(data.slot_id) === parseInt(slotId)) {
				if (parseInt(data.to_stock) === 0) {
					// setShowAlert(true);
					setShowSpan("");
				} else {
					setShowSpan("d-none");
				}
				setToStockQty(data.to_stock); // initial to stock quantity. it'll will change when +/- button on click
				setMaxNumRestock(data.to_stock); // set max num to restock
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
		console.log("hello")
		let preparedData = {};
		let preparedDataIndex =0;

		slotData.forEach(data => {
			data.forEach(element => {
				let x, y, z;
				x = element.slot_id;
				y = element.to_stock;
				z = element.product_id;
				if (toStockData.length > 0) {
					toStockData.forEach(tostock => {
						if (parseInt(tostock.slot_id) === parseInt(element.slot_id) && parseInt(tostock.tostock_qty) !== parseInt(element.slot_id)) {
							if (y) {
								x = element.slot_id; 
								y = tostock.tostock_qty;
								z = element.product_id;
								preparedData[`stock[${preparedDataIndex}][slot_id]`] = x;
								preparedData[`stock[${preparedDataIndex}][to_stock]`] = y;
								preparedData[`stock[${preparedDataIndex}][product_id]`] = z;
								preparedDataIndex++;
							}
						} else {
							if (y) {
								preparedData[`stock[${preparedDataIndex}][slot_id]`] = x;
								preparedData[`stock[${preparedDataIndex}][to_stock]`] = y;
								preparedData[`stock[${preparedDataIndex}][product_id]`] = z;
								preparedDataIndex++;
							}
						}
					});
				} else {
					if (y) {
						preparedData[`stock[${preparedDataIndex}][slot_id]`] = x;
						preparedData[`stock[${preparedDataIndex}][to_stock]`] = y;
						preparedData[`stock[${preparedDataIndex}][product_id]`] = z;
						preparedDataIndex++;
					}
				}
			});
		});

		console.log(preparedData);
		const button_put = await SERVER_REQ.put(`/api/stocks/1.json`, preparedData);
		console.log(button_put);
		if (button_put.response.success) {
			props.history.push("/management")
		}
	}

	const handleModalClose = () => {
		setShowModal(false);
	}

	// const handleButtonOk = () => {
	// 	setShowAlert(false);
	// }

	return ( <div className="vw-100 vh-100 d-flex align-items-center">
			<Container fluid className="text-uppercase">
				<Row className="justify-content-center">
					<p className="text-center custom-t2">KONFIRMASI UNTUK JUMLAH RESTOCK SLOT</p> {/* confirm the restocked quantity for slots  */}
				</Row>
				{
					(modifiedSlotData.length === 0) ? 
					slotData.map((rowData, index) => (
						<Row key={index} className="justify-content-center">
							{
								rowData.map(data => (<Col key={data.slot_id} id={'cs_' + data.slot_id} onDoubleClick={handleBtnSlotOnClick} className={(data.tied && data.max_qty !== 0) ? "col align-self-center text-center border border-1 bg-slot btn-slot" : "col align-self-center text-center border border-1 bg-slot btn-slot disable-div"} data-slotid={data.slot_id} ><p className="custom-t3 mt-3 mb-3" data-slotid={data.slot_id} >{(data.slot_active ? (((data.to_stock && (data.max_qty>data.current_stock)) || (data.max_qty === 0 && data.slot_active) || (data.max_qty === data.current_stock)) ? ((data.to_stock) ? data.to_stock : 0) + "/" + ((data.current_stock) ? data.current_stock : 0) + "/" + ((data.max_qty) ? data.max_qty : 0) : "-") : "-")}</p></Col>))
							}
						</Row>
					)) : modifiedSlotData.map((rowData, index) => (
						<Row key={index} className="justify-content-center">
							{
								rowData.map(data => (<Col key={data.slot_id} id={'cs_' + data.slot_id} onDoubleClick={handleBtnSlotOnClick} className={(data.tied && data.max_qty !== 0) ? "col align-self-center text-center border border-1 bg-slot btn-slot" : "col align-self-center text-center border border-1 bg-slot btn-slot disable-div"} data-slotid={data.slot_id} ><p className="custom-t3 mt-3 mb-3" data-slotid={data.slot_id} >{(data.slot_active ? (((data.to_stock && (data.max_qty>data.current_stock)) || (data.max_qty === 0 && data.slot_active) || (data.max_qty === data.current_stock)) ? ((data.to_stock) ? data.to_stock : 0) + "/" + ((data.current_stock) ? data.current_stock : 0) + "/" + ((data.max_qty) ? data.max_qty : 0) : "-") : "-")}</p></Col>))
							}
						</Row>
					))
				}
				<Row className="justify-content-center mt-5">
					<div className="text-center col p-2 align-self-center">
						<Link to="/management" className="btn btn-lg btn-warning">
							<h2 className="text-center text-uppercase display-4">BATAL</h2> {/* cancel */}
						</Link>
					</div>

					<div className="text-center col p-2 align-self-center">
						<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold" onClick={handleBtnMainConfirmOnClick}>
							<h2 className="text-center text-uppercase display-4">LANJUT</h2> {/* confirm */}
						</button>
					</div>
				</Row>
			<Modal show={showModal} size="xl" centered>
				<Modal.Header>
					<Modal.Title className="custom-t2 text-uppercase">
						KONFIRMASI JUMLAH STOCK ULANG {/* confirm restocked quantity */}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="justify-content-center">
						<Col lg={5} className="text-center">
							<div className="p-1 align-self-center">
								<img src={`${FORMATTER.api_base_url()}${productURL}`} className="img-thumbnail border-0" alt={productName} />
								<h1 className="text-center text-uppercase custom-t3">{productName}</h1>
							</div>
						</Col>

							<Col lg={7} className="align-self-center text-uppercase custom-t2">
								<Row>
									<label className="text-uppercase custom-t2">JUMLAH</label><span className={"text-uppercase custom-t3 text-danger " + showSpan}>(slotnya penuh)</span><br/> {/* quantity */}
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
								<h2 className="text-center text-uppercase custom-t3">BATAL</h2> {/* cancel */}
							</Button>
						</div>

						<div className="text-center">
							<Button variant="info" type="button" className="text-uppercase" onClick={handleBtnSubConfirmOnClick}>
								<h2 className="text-center text-uppercase custom-t3">LANJUT</h2> {/* confirm */}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>

				{/* <Modal show={showAlert} size="xl" centered>
					<Modal.Body>
						<p className="custom-t2 text-uppercase">slotnya penuh</p> {/* slot is full */}
					{/* </Modal.Body>
					<Modal.Footer className="text-center">
						<div className="text-center">
							<button type="button" onClick={handleButtonOk} className="btn btn-lg btn-info text-uppercase font-weight-bold ">
								<h2 className="text-center text-uppercase custom-t2">OK</h2>
							</button>
						</div>
					</Modal.Footer>
				</Modal> */} 
			</Container>
		</div>
	);
}

export default AutoTopup;