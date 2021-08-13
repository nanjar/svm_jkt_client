import React, {useState, useEffect} from "react";
import SERVER_REQ from '../../helpers/Request';
import FORMATTER from '../../helpers/Formatter';
import { Link } from 'react-router-dom';
import '../../App.css';
import imgURL from '../../assets/static_images/no_image.png';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { useIdleTimer } from 'react-idle-timer';
import LoadingOverlay from 'react-loading-overlay';

const ManualTopup = (props) => {
	const numData = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['Del', '0', 'Set']]; // data for numpad, cannot be changed
	
	const [slotID, setSlotID] = useState(false);
	const [slots, setSlots] = useState([]);
	const [slotStocks, setSlotStocks] = useState([]);
	const [isLoadingActive, setIsLoadingActive] = useState(false);
	const [btnDisable, setBtndisable] = useState("");
	const [showSpan, setShowSpan] = useState("d-none");
	const [showNumpad, setShowNumpad] = useState(false);
	const [numInput, setNumInput] = useState("");
	const [contentMsg, setContentMsg] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [firstLoad, setFirstLoad] = useState(true);

	useEffect(() => {
		if(firstLoad){
			setIsLoadingActive(true); 
			fetchLayouts();
			setFirstLoad(false)
		}
		// console.log('updatiog');
	});

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

	const fetchLayouts = () => {
		const url = `${FORMATTER.api_base_url()}/api/topups/layouts.json`; 
		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				const data = response.data.sort(FORMATTER.array_sort('slot_id')).filter(x => x.slot_active);
				// console.log(data)
				setSlots(data);
				setSlotStocks(data.map(slot => {
					const {slot_id} = slot;
					return {slot_id, to_stock: 0}
				}));
				if(!slotID) setSlotID(data[0].slot_id)
				setIsLoadingActive(false);
			})
			.catch(error => console.log(error.message));
	}

	
	const handleSlotPlus = () => 	{
		const activeSlotIndex = slots.findIndex(x => x.slot_id === parseInt(slotID));
		setSlotID((activeSlotIndex === -1)? slots[0].slot_id : ((activeSlotIndex + 1 < slots.length) ? slots[activeSlotIndex+1].slot_id : slots[activeSlotIndex].slot_id));
	}

	const handleSlotMinus = () => {
		const activeSlotIndex = slots.findIndex(x => x.slot_id === parseInt(slotID));
		// console.log(activeSlotIndex)
		setSlotID((activeSlotIndex === -1) ? slots[0].slot_id : (slots[(activeSlotIndex !== 0) ? (activeSlotIndex - 1) : activeSlotIndex].slot_id));
	}


	const handlePlus = () => {
		const slot = slots.find(x => parseInt(x.slot_id) === parseInt(slotID) )
		const slotIndex = slotStocks.findIndex(x => x.slot_id === parseInt(slotID))
		if(slot && slotStock){
			// console.log("insert")
			if (slotStock.to_stock === slot.to_stock) {
				setBtndisable("disable");
			} else {
				if (slotStock.to_stock < (slot.max_qty === 0) ? 12 : (slot.max_qty - slot.current_stock)) {
					setSlotStocks(slotStocks.map(stock => {
						if(parseInt(stock.slot_id) === parseInt(slotID)){
							stock.to_stock += 1;
						}else{
							stock.to_stock = 0;
						}
						return stock;
					}))
				} 
			}
		}
	}

	const handleMinus = () => {
		const slot = slots.find(x => parseInt(x.slot_id) === parseInt(slotID));
		if (slot && slotStock) {
			setSlotStocks(slotStocks.map(stock => {
				if (parseInt(stock.slot_id) === parseInt(slotID)) {
					const maxNum = (slot.current_stock > stock.to_stock) ? slot.current_stock  : stock.to_stock;
					if ((parseInt(stock.to_stock) * -1) < maxNum) {
						stock.to_stock -= 1;
					}
				} else {
					stock.to_stock = 0;
				}
				return stock;
			}));
		}
	}

	const handleButtonOk = () => {
		setShowModal(false);
	}

	const handleShowNumpad = () => {
		setShowNumpad(true);
		setNumInput("");
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
		} else if ( num === "Del") {
			setNumInput(oldNum.slice(0, -1));
			setSlotID(oldNum.slice(0, -1));
		} else {
			if (oldNum.charAt(0) === "0") {
				let newNum = oldNum + num;
				while(newNum.charAt(0) === '0')
				{
					newNum = newNum.substring(1);
				}
				setNumInput(newNum);
				setSlotID(newNum);
			} else {
				setNumInput(oldNum + num);
				setSlotID(oldNum + num);
			}
		}
	}
	const handleBtnConfirmOnClick = async() => {
		// console.log("click confirm", slotID, slotStock.to_stock, slot.product_id);
		if (!slot) {
			let msg = "HARAP MASUKKAN NOMOR SLOT DAN SETEL JUMLAH PRODUK"; // please key in the slot number and set the quantity.
			setShowModal(true);
			setContentMsg(msg);
		} else {
			// console.log("click confirm", slotID, slotStock.to_stock, slot.product_id);
			if (slotStock.to_stock < slot.to_stock) {
				setIsLoadingActive(true);
				let preparedData = {};
				preparedData[`stock[slot_id]`] = parseInt(slotID);
				preparedData[`stock[to_stock]`] = slotStock.to_stock;
				preparedData[`stock[product_id]`] = slot.product_id;
				const button_post = await SERVER_REQ.post(`/api/stocks.json`, preparedData);
				const resp_current_stock = button_post.response.current_stock;
				fetchLayouts();
			} else {
				let msg = "TIDAK PERLU PENYETOKAN"; // slot is full. no need to topup.
				setShowModal(true);
				setContentMsg(msg);
			}
		}
	}

	const slot = slots.find(x => parseInt(x.slot_id) === parseInt(slotID))
	const slotStock = slotStocks.find(x => parseInt(x.slot_id) === parseInt(slotID))

	return (<LoadingOverlay active={isLoadingActive} spinner text='Loading ...'>
		<div className="vw-100 vh-100 d-flex align-items-center background-Img overflow-hidden">
			<Container fluid>
				<Row className="justify-content-center mb-5">
					<h1 className="text-center text-uppercase display-3">KONFIRMASI JUMLAH PENYETOKAN ULANG</h1> {/* confirm/edit the restocked quantity */}
				</Row>

				<Row className="justify-content-center pt-5 pb-5 background-Color">
					<Col lg={5} className="text-center">
						<div className="p-2 align-self-center">
							<img src={slot ? `${FORMATTER.api_base_url()}${slot.image}` : imgURL} className="img-thumbnail border-0" alt={slot ? slot.product_name : ""} />
							<h1 className="text-center text-uppercase custom-t2">{slot ? slot.product_name : ""}</h1>
						</div>
					</Col>

					<Col lg={7} className="align-self-center text-uppercase custom-t2">
						<Row className="mb-2">
							<label className="text-uppercase custom-t2">SLOT <span className={"text-uppercase custom-t3 text-danger " + showSpan}>(TIDAK PERLU PENYETOKAN)</span></label><br/>
							{/* <Col lg={10} className="p-0">
								<input type="text" onClick={handleShowNumpad} value={slotID} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} placeholder="MASUKKAN NOMOR SLOT" /> enter the slot number
							</Col> */}
							<Col lg={2} className="p-0">
								<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={handleSlotMinus} />
							</Col>
							<Col lg={6} className="p-0">
								<input type="number" value={slotStock ? slotStock.slot_id : ""} className="form-control border border-1 form-control-lg custom-t1" onClick={handleShowNumpad} readOnly={true} />
							</Col>
							<Col lg={2} className="p-0">
								<input type="button" value="+" className={"form-control btn border border-1 form-control-lg font-weight-bold custom-t1 " + btnDisable} onClick={handleSlotPlus} />
							</Col>
						</Row>

						<Row>
							<label className="text-uppercase custom-t2">JUMLAH STOK</label><br/> {/* quantity */}
							<label className="text-uppercase custom-t5">KUANTITAS SEKARANG - {slot ? slot.current_stock : 0}, KUANTITAS MAKSIMAL - {slot ? slot.max_qty : 0}</label><br/> {/* current quantity, max quantity */}
							<Col lg={2} className="p-0">
								<input type="button" value="-" className="form-control btn border border-1 form-control-lg font-weight-bold custom-t1" onClick={handleMinus} />
							</Col>
							<Col lg={6} className="p-0">
								<input type="number" value={slotStock ? slotStock.to_stock : 0} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} />
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