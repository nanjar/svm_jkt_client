import React, {useState, useEffect} from "react";
import SERVER_REQ from '../../helpers/Request';
import FORMATTER from '../../helpers/Formatter';
import { Link } from 'react-router-dom';
import '../../App.css';
import imgURL from '../../assets/static_images/no_image.png';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { useIdleTimer } from 'react-idle-timer';
import LoadingOverlay from 'react-loading-overlay';
let FIRSTLOAD = true
const ManualTopup = (props) => {
	const numData = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['Del', '0', 'Set']]; // data for numpad, cannot be changed

	const [slotData, setSlotData] = useState([]);
	const [isLoadingActive, setIsLoadingActive] = useState(false);
	const [productURL, setProductURL] = useState(imgURL);
	const [productName, setProductName] = useState("");
	const [productId, setProductId] = useState(false);
	const [toStockQty, setToStockQty] = useState(0);
	const [currentStock, setCurrentStock] = useState(0);
	const [maxQty, setMaxQty] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [slotId, setSlotId] = useState("");
	const [showNumpad, setShowNumpad] = useState(false);
	const [numInput, setNumInput] = useState("");
	const [contentMsg, setContentMsg] = useState("");
	const [maxNumRestock, setMaxNumRestock] = useState("");
	const [btnDisable, setBtndisable] = useState("");
	const [showSpan, setShowSpan] = useState("d-none");
	const [activeSlots, setActiveSlots] = useState([]);
	const [firstLoad, setFirstLoad] = useState(true)
	
	useEffect(() => {
		if (firstLoad){
			setFirstLoad(false)
			// console.log('always fetching')
			fetchlayout();
		}
		// console.log('Do something after slot has changed', slotId);
		if (!showNumpad) handleSlotId();
	}, [slotId, isLoadingActive]);

	const fetchlayout = () => {
		const url = `${FORMATTER.api_base_url()}/api/topups/layouts.json`; 
		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				const data = response.data;
				setSlotData(data);
				if (slotId === "" ) { setSlotId(0) }
				let temp = [];
				data.forEach(x => {
					if (x['slot_active']) {
						temp.push(x['slot_id']);
					}
				});
				setActiveSlots(temp);
			})
			.catch(error => console.log(error.message));
	}
	const duration = 10; // 10 minutes

	let timer = 1000 * 60 * duration; // set timer

	const handleOnAction = (event) => {
		// console.log("user did something", event);
		timer = 1000 * 60 * duration; // reset timer
		// console.log("remaining time 1 ", getRemainingTime());
	}

	const handleOnActive = (event) => {
		// console.log("user is active", event);
		timer = 1000 * 60 * duration; // reset timer
		// console.log("remaining time 2 ", getRemainingTime());
	}

	const handleOnIdle = (event) => {
		// console.log("user is idle", event);
		// console.log("remaining time 3 ", getRemainingTime());
		props.history.push("/");
	}

	const { getRemainingTime } = useIdleTimer({
		timeout: timer,
		onIdle: handleOnIdle,
		onActive: handleOnActive,
		onAction: handleOnAction
	});

	const handlePlus = () => {
		// const {current_stock, max_qty} = product
		// if( product.to_stock === ( max_qty - current_stock ) ){
		// 	setBtndisable("disable")
		// }else{
		// 	if(product.to_stock < (max_qty === 0 ? 12 : max_qty - current_stock)){
		// 		product.to_stock += 1
		// 		setToStockQty(product.to_stock)
		// 	}
		// }
		if (parseInt(toStockQty) === parseInt(maxNumRestock)) {
			setBtndisable("disable");
		} else {
			// console.log("maxQty", maxQty)
			if (parseInt(toStockQty) < ((parseInt(maxQty) === 0) ? 12 : (parseInt(maxQty) - parseInt(currentStock)))) {
				setToStockQty(parseInt(toStockQty) + 1);
			} 
		}
	}

	const handleMinus = () => {
		// if (parseInt(toStockQty) > 0) {
		// 	setToStockQty(parseInt(toStockQty) - 1);
		// }
		// if(product){
		// 	console.log('hello')
		// 	product.to_stock -= 1
		// 	setToStockQty(product.to_stock)
		// }
		// to allow negative value
		setToStockQty(parseInt(toStockQty) - 1);
	}

	// Slot +/- buttons will work on the activeSlots indexes
	const handleSlotPlus = () => 	{
		const activeSlotIndex = activeSlots.indexOf(parseInt(slotId));
		setSlotId((activeSlotIndex === -1)? activeSlots[0] : ((activeSlotIndex + 1 < activeSlots.length) ? activeSlots[activeSlotIndex+1] : activeSlots[activeSlotIndex]));
	}

	const handleSlotMinus = () => {
		const activeSlotIndex = activeSlots.indexOf(parseInt(slotId));
		setSlotId((activeSlotIndex === -1) ? "" : (activeSlots[(activeSlotIndex !== 0) ? (activeSlotIndex - 1) : activeSlotIndex]));
	}

	// show alert if slot is inactive else set the data to send 
	const handleSlotId = () => {
		// console.log("num", numInput);
		// console.log("slot", slotId);
		const slotIds = (slotData.length > 0) ? slotData.map(x => x['slot_id']) : [];
		setBtndisable(false); // reset disabled button
		// console.log("slot ids", slotIds);
		if (slotId !== "") {
			const product = slotData.find(x => parseInt(x.slot_id) === parseInt(slotId) );
			if(product){
				// setToStockQty(slot.to_stock);
				setToStockQty(0);
				setProductId(product.product_id);
				setProductURL(`${FORMATTER.api_images()}${product.image}`);
				setProductName(product.product_name);
				setMaxNumRestock(product.to_stock);
				setCurrentStock(product.current_stock);
				setMaxQty(product.max_qty);
				if (product.to_stock === 0) {
					setShowSpan("");
				// 	setContentMsg("slotnya penuh"); // slot is full
				// 	setShowModal(true); // show alert when to_stock is 0
				} else {
					setShowSpan("d-none");
				}
			}else{
				// cond 1: invalid slot! please key in the valid slot number, cond 2: Slot slot_id is inactive. please key in the active slot number.
				let msg = (parseInt(slotId) > 60) ? "SLOT TIDAK SAH! HARAP MASUKKAN NOMOR SLOT YANG SAH" : "Slot " + slotId + "  TIDAK AKTIF. HARAP MASUKKAN NOMOR SLOT AKTIF"; 
				setShowModal(true);
				setContentMsg(msg);
				setToStockQty(0);
				setCurrentStock(0);
				setMaxQty(0);
			}
			// if (slotIds.includes(parseInt(slotId))) {
			// 	slotData.forEach(slot => {
			// 		if (parseInt(slotId) === slot.slot_id) {
			// 			// setToStockQty(slot.to_stock);
			// 			setToStockQty(0);
			// 			setProductId(slot.product_id);
			// 			setProductURL(`${FORMATTER.api_base_url()}${slot.image}`);
			// 			setProductName(slot.product_name);
			// 			setMaxNumRestock(slot.to_stock);
			// 			setCurrentStock(slot.current_stock);
			// 			setMaxQty(slot.max_qty);
			// 			if (slot.to_stock === 0) {
			// 				setShowSpan("");
			// 			// 	setContentMsg("slotnya penuh"); // slot is full
			// 			// 	setShowModal(true); // show alert when to_stock is 0
			// 			} else {
			// 				setShowSpan("d-none");
			// 			}
			// 		}
			// 	});
			// } else {
			// 	// cond 1: invalid slot! please key in the valid slot number, cond 2: Slot slot_id is inactive. please key in the active slot number.
			// 	let msg = (parseInt(slotId) > 60) ? "SLOT TIDAK SAH! HARAP MASUKKAN NOMOR SLOT YANG SAH" : "Slot " + slotId + "  TIDAK AKTIF. HARAP MASUKKAN NOMOR SLOT AKTIF"; 
			// 	setShowModal(true);
			// 	setContentMsg(msg);
			// 	setToStockQty(0);
			// 	setCurrentStock(0);
			// 	setMaxQty(0);
			// }
		}
	}

	const handleBtnConfirmOnClick = async() => {
		// console.log("click confirm", slotId, toStockQty, productId);
		if (slotId === "") {
			let msg = "HARAP MASUKKAN NOMOR SLOT DAN SETEL JUMLAH PRODUK"; // please key in the slot number and set the quantity.
			setShowModal(true);
			setContentMsg(msg);
		} else {
			// console.log("clicked confirm button", slotId, toStockQty, productId);
			if (parseInt(toStockQty) < maxNumRestock) {
				setIsLoadingActive(true);
				let preparedData = {};
				preparedData[`stock[slot_id]`] = parseInt(slotId);
				preparedData[`stock[to_stock]`] = toStockQty;
				preparedData[`stock[product_id]`] = productId;
				// console.log("max_qty", maxQty);
				// console.log(preparedData);
				const button_post = await SERVER_REQ.post(`/api/stocks.json`, preparedData);
				const resp_current_stock = button_post.response.current_stock;
				// console.log(resp_current_stock);
				if (resp_current_stock) { 
					setIsLoadingActive(false); 
					// console.log("isLoading", isLoadingActive);
					setCurrentStock(resp_current_stock);
					setToStockQty(0);
					if (maxQty - resp_current_stock !== 0) {
						setShowSpan("d-none");
					}
					// console.log(button_post);
					if (button_post.response.success) {
						props.history.push("/management/manual_topup");
					}
				}
			} else {
				let msg = "TIDAK PERLU PENYETOKAN"; // slot is full. no need to topup.
				setShowModal(true);
				setContentMsg(msg);
			}
		}
	}

	const handleButtonOk = () => {
		setShowModal(false);
		setNumInput("");
		setSlotId("");
		setProductURL(imgURL);
		setProductName("");
		setShowSpan("d-none");
	}

	const handleShowNumpad = () => {
		setShowNumpad(true);
		setNumInput("");
		// if (showNumpad) {handleSlotId();}
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
			setShowNumpad(false);
			if (numInput === "") {
				setProductURL(imgURL);
				setProductName("");
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
	
	let slotList = [];
	Object.values(slotData).forEach((slot) => {
		slotList.push(<option key={slot.slot_id} value={slot.product_id}>{slot.slot_id}</option>);
	});
	const product = slotData.find(x => parseInt(x.slot_id) === parseInt(slotId) );
	return ( <LoadingOverlay active={isLoadingActive} spinner text='Loading ...'>
		<div className="vw-100 vh-100 d-flex align-items-center background-Img overflow-hidden">
			<Container fluid>
				<Row className="justify-content-center mb-5">
					<h1 className="text-center text-uppercase display-3">KONFIRMASI JUMLAH PENYETOKAN ULANG</h1> {/* confirm/edit the restocked quantity */}
				</Row>

				<Row className="justify-content-center pt-5 pb-5 background-Color">
					<Col lg={5} className="text-center">
						<div className="p-2 align-self-center">
							<img src={product ? `${FORMATTER.api_images()}${product.image}` : imgURL} className="img-thumbnail border-0" alt={product ? product.product_name : ""} />
							<h1 className="text-center text-uppercase custom-t2">{product ? product.product_name : ""}</h1>
						</div>
					</Col>

					<Col lg={7} className="align-self-center text-uppercase custom-t2">
						<Row className="mb-2">
							<label className="text-uppercase custom-t2">SLOT <span className={"text-uppercase custom-t3 text-danger " + showSpan}>(TIDAK PERLU PENYETOKAN)</span></label><br/>
							{/* <Col lg={10} className="p-0">
								<input type="text" onClick={handleShowNumpad} value={slotId} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} placeholder="MASUKKAN NOMOR SLOT" /> enter the slot number
							</Col> */}
							<Col lg={2} className="p-0">
								<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={handleSlotMinus} />
							</Col>
							<Col lg={6} className="p-0">
								<input type="number" value={product ? product.slot_id : ""} className="form-control border border-1 form-control-lg custom-t1" onClick={handleShowNumpad} readOnly={true} />
							</Col>
							<Col lg={2} className="p-0">
								<input type="button" value="+" className={"form-control btn border border-1 form-control-lg font-weight-bold custom-t1 " + btnDisable} onClick={handleSlotPlus} />
							</Col>
						</Row>

						<Row>
							<label className="text-uppercase custom-t2">JUMLAH STOK</label><br/> {/* quantity */}
							<label className="text-uppercase custom-t5">KUANTITAS SEKARANG - {currentStock}, KUANTITAS MAKSIMAL - {maxQty}</label><br/> {/* current quantity, max quantity */}
							<Col lg={2} className="p-0">
								<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={handleMinus} />
							</Col>
							<Col lg={6} className="p-0">
								<input type="number" value={toStockQty} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} />
							</Col>
							<Col lg={2} className="p-0">
								<input type="button" value="+" className={"form-control btn border border-1 form-control-lg font-weight-bold custom-t1 " + btnDisable} onClick={handlePlus} />
							</Col>
						</Row>
					</Col>
				</Row>

				<Row className="mt-5">
					<div className="text-center col p-2 align-self-center">
						<Link to="/management" className="btn btn-lg btn-warning p-3">
								<h2 className="text-center text-uppercase display-4">BATAL</h2> {/* cancel */}
						</Link>
					</div>

					<div className="text-center col p-2 align-self-center">
						<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold p-3" onClick={handleBtnConfirmOnClick}>
							<h2 className="text-center text-uppercase display-4">LANJUT</h2> {/* confirm */}
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
								<h2 className="text-center text-uppercase custom-t2">OK</h2>
							</button>
						</div>
					</Modal.Footer>
				</Modal>

				<Modal show={showNumpad} size="md" centered className="text-uppercase">
					<label className="custom-t2" style={{paddingLeft: "90%", cursor: "pointer"}} onClick={handleHideNumpad}>&times;</label>
					<Modal.Body className="m-3 mt-0">
						<Row>
							<input type="text" value={numInput} className="form-control border form-control-lg custom-t1" readOnly={true} />
						</Row>
						{
							numData.map((rowData, rowIndex) => (
								<Row key={'row-' + rowIndex} className="justify-content-center">
									{
										rowData.map((num, index) => (
											<Col key={index} onClick={handleNumInput} className="col align-self-center text-center border bg-slot btn-slot" data-num={num}><p data-num={num} className="custom-t3 mt-3 mb-3" >{num}</p></Col>
										))
									}	
								</Row>
							))
						}
					</Modal.Body>
				</Modal>
			</Container>
		</div>
	</LoadingOverlay>);
}

export default ManualTopup;