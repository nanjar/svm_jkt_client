import {useState, useEffect} from "react";
import SERVER_REQ from '../../helpers/Request';
import FORMATTER from '../../helpers/Formatter';
import { Link } from 'react-router-dom';
import '../../App.css';
import imgURL from '../../assets/static_images/no_image.png';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { useIdleTimer } from 'react-idle-timer';
import LoadingOverlay from 'react-loading-overlay';

const AutoTopup = (props) => {
	var toStockData = [];
	const isLocal = (window.location.hostname === "localhost") ? true : false;
	const [firstLoad, setFirstLoad] = useState(true);
	const [slotData, setSlotData] = useState([]);
	const [isLoadingActive, setIsLoadingActive] = useState(true);
	const [activeSlot, setActiveSlot] = useState(0);
	const [modifiedSlotData, setModifiedSlotData] = useState([]);
	const [productURL, setProductURL] = useState(imgURL);
	const [productName, setProductName] = useState("");
	const [toStockQty, setToStockQty] = useState(0);
	const [slotId, setSlotId] = useState(0);
	const [showModal, setShowModal] = useState(false);
	// const [showAlert, setShowAlert] = useState(false);
	const [showSpan, setShowSpan] = useState("d-none");
	const [isUnlock, setIsUnlock] = useState(false);

	useEffect(() => {
		if (firstLoad) {
			fecthSlotData();
			setFirstLoad(false);
		}
	}, [isUnlock]);

	const duration = 10; // 10 minutes
	let timer = 1000 * 60 * duration; // set timer

	const handleOnAction = (event) => {
		timer = 1000 * 60 * duration; // reset timer
	}

	const handleOnActive = (event) => {
		timer = 1000 * 60 * duration; // reset timer
	}

	const handleOnIdle = (event) => {
		props.history.push("/");
	}
	
	const { getRemainingTime } = useIdleTimer({
		timeout: timer,
		onIdle: handleOnIdle,
		onActive: handleOnActive,
		onAction: handleOnAction
	});

	const fecthSlotData = () => {
		const url = `${FORMATTER.api_base_url()}/api/topups/layouts.json`; // https://localhost/api/slots/unlock.json
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
							slot_id: Date.now().toString(36) + Math.random().toString(36).substring(2), // add dummy unique data for the inactive/free slots of a level, to use it as the key value of the HTML element
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
				setIsLoadingActive(false);
			})
			.catch(error => console.log(error.message));
	}

	const handleBtnSlotOnClick = (event) => {
		event.preventDefault();
		let slotId = event.target.getAttribute("data-slotid");
		slotData.forEach((rowData, i) => {
			const slot = rowData.find(x => parseInt(x.slot_id) === parseInt(slotId));
			if (slot !== undefined) {
				// console.log("active slot id", slot.slot_id)
				if (parseInt(slot.max_qty) === parseInt(slot.current_stock)) {
					setShowSpan("");
				} else {
					setShowSpan("d-none");
				}
				setToStockQty(0); // initialise the stocakable quantity. it'll will change on +/- button click
				setActiveSlot(slot);
				setSlotId(slot.slot_id);
				setProductURL(slot.image);
				setProductName(slot.product_name);
				setShowModal(true);
			}
		});	
	} 
	
	const handlePlus = () => {
		// console.log(activeSlot.to_stock, toStockQty, activeSlot.current_stock, activeSlot.max_qty)
		if (activeSlot.to_stock + activeSlot.current_stock === activeSlot.max_qty) {
			if (toStockQty < (activeSlot.to_stock)) {
				setToStockQty(toStockQty + 1);
			}
		} else {
			if (toStockQty < (activeSlot.max_qty - (activeSlot.to_stock + activeSlot.current_stock))) {
				setToStockQty(toStockQty + 1);
			}
		}
	}

	const handleMinus = () => {
		// console.log(activeSlot.to_stock, toStockQty, activeSlot.current_stock, activeSlot.max_qty)
		if (activeSlot.to_stock < 0) {
			if ((toStockQty * -1) < activeSlot.current_stock) {
				// console.log("1");
				setToStockQty(toStockQty - 1);
			}
		} else {
			if (activeSlot.to_stock + activeSlot.current_stock === activeSlot.max_qty) {
				if ((toStockQty * -1) < activeSlot.current_stock) {
					// console.log("2");
					setToStockQty(toStockQty - 1);
				}
			} else {
				if ((toStockQty * -1) < (activeSlot.current_stock + activeSlot.to_stock)) {
					// console.log("3");
					setToStockQty(toStockQty - 1);
				}
			}
		}
	}

	const handleBtnSubConfirmOnClick = () => {
		// console.log("modifiedSlotData", modifiedSlotData);
		if (modifiedSlotData.length === 0) {
			slotData.forEach((rowData, i) => {
				const slotIndex = rowData.findIndex(x => parseInt(x.slot_id) === parseInt(slotId));
				if (slotIndex !== undefined && rowData[slotIndex] !== undefined) {
					// console.log(slotIndex)
					// rowData[slotIndex]['to_stock'] = toStockQty;
					if (parseInt(activeSlot.to_stock) === (parseInt(activeSlot.max_qty) - parseInt(activeSlot.current_stock))) {
						rowData[slotIndex]['to_stock'] = toStockQty;
					} else {
						rowData[slotIndex]['to_stock'] = parseInt(activeSlot.to_stock) + toStockQty;
					}
				}
			});
			setModifiedSlotData(slotData);
		} else {
			// console.log("modified", modifiedSlotData);
			modifiedSlotData.forEach((rowData, i) => {
				const slotIndex = rowData.findIndex(x => parseInt(x.slot_id) === parseInt(slotId));
				if (slotIndex !== undefined && rowData[slotIndex] !== undefined) {
					// console.log(slotIndex)
					// rowData[slotIndex]['to_stock'] = toStockQty;
					if (parseInt(activeSlot.to_stock) === (parseInt(activeSlot.max_qty) - parseInt(activeSlot.current_stock))) {
						rowData[slotIndex]['to_stock'] = toStockQty;
					} else {
						rowData[slotIndex]['to_stock'] = parseInt(activeSlot.to_stock) + toStockQty;
					}
				}
			});
			setModifiedSlotData(modifiedSlotData);
		}
		
		setShowModal(false);
		if (toStockData.length > 0) {
			const toStockSlotIndex = toStockData.findIndex(x => parseInt(x.slot_id) === parseInt(slotId));
			if (toStockSlotIndex !== undefined && toStockData[toStockSlotIndex] !== undefined) {
				toStockData[toStockSlotIndex]['slot_id'] = slotId;
				toStockData[toStockSlotIndex]['tostock_qty'] = toStockQty;
			}
		} else {
			toStockData.push({slot_id: slotId, tostock_qty: toStockQty});
		}
	}

	const handleBtnMainConfirmOnClick = async(event) => {
		setIsLoadingActive(true);
		// console.log("hello")
		let preparedData = {};
		let preparedDataIndex =0;

		// prepare data to post to server
		slotData.forEach(data => {
			data.forEach(element => {
				let x, y, z;
				x = element.slot_id;
				y = element.to_stock;
				z = element.product_id;
				if (toStockData.length > 0) {
					toStockData.forEach(tostock => {
						if (parseInt(tostock.slot_id) === parseInt(element.slot_id) && parseInt(tostock.tostock_qty) !== parseInt(element.slot_id)) { // update the edited quantity of slot for preparedData object
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

		// console.log("auto topup post", preparedData);
		// data sample : preparedData - {[stock[0][slot_id]: 1, stock[0]['to_stock']: 2, stock[0]['product_id']: 3]}
		const button_put = await SERVER_REQ.put(`/api/stocks/1.json`, preparedData);
		if (button_put.status === 200) { setIsLoadingActive(false); }
		// console.log("button_put", button_put);
		if (button_put.response.success) {
			props.history.push("/management/auto_topup");
		}
	}

	const handleModalClose = () => {
		setShowModal(false);
	}

	const handleBthUnlockOnClick = async(event) => {
		const unlock_req = await SERVER_REQ.get(`/api/slots/unlock.json`);
		// console.log("unlock_req", unlock_req);
		if (unlock_req.response.success) {
			setIsUnlock(true);
			props.history.push("/management/auto_topup");
		}
	}

	const cancelTxt = (isLocal) ? "batal" : "cancel";
	const confirmTxt = (isLocal) ? "lanjut" : "confirm";
	const titleTxt = (isLocal) ? "KONFIRMASI UNTUK JUMLAH STOK" : "restock quantity for slots";
	const quantityTxt = (isLocal) ? "jumlah" : "quantity";
	const alertTxt = (isLocal) ? "tidak perlu penyetokan" : "no need to stock";
	const modalTitleTxt = (isLocal) ? "KONFIRMASI JUMLAH STOK" : "confirm restock quantity";
		
	return (  <LoadingOverlay active={isLoadingActive} spinner text='Loading ...'>
		<div className="vw-100 vh-100 background-Img align-items-center overflow-hidden">
			<div className="p-2 text-uppercase">
				<div className="row mb-3">
					<div className="col-10">
						<p className="custom-t2" style={{ paddingLeft: "4vw" }}>{titleTxt}</p> {/* confirm the restocked quantity for slots  */}
						{!isLocal ? <span>1/2/3/ - (1: to stock item count, 2: current item count, 3: max item count)</span> : ""}
					</div>
					<div className="col-2">
						<Button variant="warning" type="button" className="text-uppercase p-3" onClick={handleBthUnlockOnClick}>
							<h2 className="text-center text-uppercase custom-t3">unlock</h2> {/* unlock */}
						</Button>
					</div>
				</div>
				{
					(modifiedSlotData.length === 0) ? 
					slotData.map((rowData, index) => (
						<div key={index} className="row background-Color">
							{
								rowData.map(data => (<div key={data.slot_id} id={'cs_' + data.slot_id} onClick={handleBtnSlotOnClick} className={((data.tied && data.max_qty !== 0) ? "col border p-0" : "col p-0 border") + ((parseInt(data.slot_status) === 1) ? " locked-color" : " ")} data-slotid={data.slot_id}>
									<div className={"row m-0 " + ((parseInt(data.slot_status) === 1) ? " locked-color" : " slot-color")}>
										<span className="text-center mt-1 mb-1">{(typeof(data.slot_id) !== "string") ? data.slot_id : "-"}</span>
									</div>
									<div className="row m-0">
										<div className={"text-center " + ((parseInt(data.slot_status) === 1) ? " locked-color" : " current-max-color") + " col-8 p-0"}>
											{((!isLocal) ? (data.product_name ? data.product_name : <span>&nbsp;</span>) : "")}<p className={"custom-t5" + ((isLocal) ? " mt-4 mb-4" : "")} data-slotid={data.slot_id}>{(data.slot_active ? (((data.current_stock) ? data.current_stock : 0) + "/" + ((data.max_qty) ? data.max_qty : 0)) : "-")}</p>
										</div>
										<div className={"text-center col-4 p-0 " + ((parseInt(data.slot_status) === 1) ? " locked-color" : " topup-color")}>
											<p className={"custom-t5" + ((isLocal) ? " mt-4 mb-4" : "")} data-slotid={data.slot_id}>{(data.slot_active ? (((data.max_qty > data.current_stock) || (data.max_qty === 0 && data.slot_active) || (data.max_qty === data.current_stock)) ? ((data.to_stock) ? ("+" + data.to_stock) : 0) : "-") : "-")}</p>
										</div>
										
									</div>
								</div>))
							}
						</div>
					)) : modifiedSlotData.map((rowData, index) => (
						<div key={index} className="row background-Color">
							{
								rowData.map(data => (<div key={data.slot_id} id={'cs_' + data.slot_id} onClick={handleBtnSlotOnClick} className={((data.tied && data.max_qty !== 0) ? "col border p-0" : "col p-0 border") + ((parseInt(data.slot_status) === 1) ? " locked-color" : " ")} data-slotid={data.slot_id}>
								<div className={"row m-0 " + ((parseInt(data.slot_status) === 1) ? " locked-color" : " slot-color")}>
									<span className="text-center mt-1 mb-1">{(typeof(data.slot_id) !== "string") ? data.slot_id : "-"}</span>
								</div>
								<div className="row m-0">
									<div className={"text-center " + ((parseInt(data.slot_status) === 1) ? " locked-color" : " current-max-color") + " col-8 p-0"}>
										{((!isLocal) ? (data.product_name ? data.product_name : <span>&nbsp;</span>) : "")}<p className={"custom-t5" + ((isLocal) ? " mt-4 mb-4" : "")} data-slotid={data.slot_id}>{(data.slot_active ? (((data.current_stock) ? data.current_stock : 0) + "/" + ((data.max_qty) ? data.max_qty : 0)) : "-")}</p>
									</div>
									<div className={"text-center col-4 p-0 " + ((parseInt(data.slot_status) === 1) ? " locked-color" : " topup-color")}>
										<p className={"custom-t5" + ((isLocal) ? " mt-4 mb-4" : "")} data-slotid={data.slot_id}>{(data.slot_active ? (((data.max_qty > data.current_stock) || (data.max_qty === 0 && data.slot_active) || (data.max_qty === data.current_stock)) ? ((data.to_stock) ? ("+" + data.to_stock) : 0) : "-") : "-")}</p>
									</div>
									
								</div>
							</div>))
							}
						</div>
					))
				}
				<Row className={"" + ((isLocal) ? " mt-3" : " mt-1")}>
					<div className="text-center col p-2 align-self-center">
						<Link to="/management" className="btn btn-lg btn-warning p-3">
							<h2 className="text-center text-uppercase display-4">{cancelTxt}</h2> {/* cancel */}
						</Link>
					</div>

					<div className="text-center col p-2 align-self-center">
						<button type="button" className="btn btn-lg btn-info text-uppercase font-weight-bold p-3" onClick={handleBtnMainConfirmOnClick}>
							<h2 className="text-center text-uppercase display-4">{confirmTxt}</h2> {/* confirm */}
						</button>
					</div>
				</Row>

				<Modal show={showModal} size="xl" centered>
					<Modal.Header className="modal-background">
						<Modal.Title className="custom-t2 text-uppercase">
							{modalTitleTxt} {/* confirm restocked quantity */}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row className="justify-content-center">
							<Col lg={5} className="text-center">
								<div className="p-1 align-self-center">
									<img src={`${FORMATTER.api_images()}${productURL}`} className="img-thumbnail border-0" alt={productName} />
									<h1 className="text-center text-uppercase custom-t3">{productName}</h1>
								</div>
							</Col>

							<Col lg={7} className="align-self-center text-uppercase custom-t2">
								<Row>
									<label className="text-uppercase custom-t2">{quantityTxt}</label><span className={"text-uppercase custom-t3 text-danger " + showSpan}>{alertTxt}</span><br/> {/* quantity */}
									<Col lg={2} className="p-0">
										<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t2" onClick={handleMinus} />
									</Col>
									<Col lg={6} className="p-0">
										<input type="number" value={toStockQty} className="form-control border border-1 form-control-lg custom-t2" readOnly={true} />
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
							<Button variant="warning" type="button" className="text-uppercase p-3" onClick={handleModalClose}>
								<h2 className="text-center text-uppercase custom-t3">{cancelTxt}</h2> {/* cancel */}
							</Button>
						</div>

						<div className="text-center">
							<Button variant="info" type="button" className="text-uppercase p-3" onClick={handleBtnSubConfirmOnClick}>
								<h2 className="text-center text-uppercase custom-t3">{confirmTxt}</h2> {/* confirm */}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	</LoadingOverlay>);
}

export default AutoTopup;