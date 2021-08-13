import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../services/socket';
import SERVER_REQ  from '../../helpers/Request';
import FORMATTER  from '../../helpers/Formatter';
import {useHistory} from 'react-router-dom';
import logo from '../../assets/static_images/Logo.png';
import { Container, Row, Button, Modal, Carousel, CarouselItem } from 'react-bootstrap';
import { useIdleTimer } from 'react-idle-timer';

const BUTTON_E = "button_pressed";

const activate_button = (socket) => {
	socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 1000, reply_to: BUTTON_E })
}

const MachineShop = () => {
		const [showAlert, setShowAlert] = useState(false);
		const socket = useContext(SocketContext);
		const history = useHistory();
		const carouselInterval = 10 * 1000; // 10 seconds, can set by backend, may be more than one interval
		const [start, setStart] = useState(0);
		const [clickBtn1, setClickBtn1] = useState(false);
		const [carouselItems, setCarouselItems] = useState([]);

    useEffect(() => {
        let button_pressed = false;

		socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 50, reply_to: BUTTON_E });
        const button_event = async (data) => {
            data = JSON.parse(data);
            // console.log(data);
            if(button_pressed)
                return;
            button_pressed = true;
			if (button_pressed) { setShowAlert(false); } // close EmptyStockModal at the button pressed
            const button = data.button_no
            if(button === 0 )
                return;
            socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 1000, reply_to: BUTTON_E });
            // console.log('pressed')
            const button_req = await SERVER_REQ.get(`/api/buttons/${button}.json`);
						// console.log(button_req);
			const button_response = button_req.response
			if(!button_response.success){
				button_pressed=false;
				setShowAlert(false);
				setTimeout( () => socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 200, reply_to: BUTTON_E }), 500);
				return;
			}
            const button_detail = button_req.response.data;
			
            const product_detail = {name: button_detail.product.name, url: button_detail.product.image_url, slots: button_detail.slot_available}
            const url_params = new URLSearchParams(product_detail);
            // console.log(button_detail, `/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`);
            history.push(`/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`)
		}
        socket.off(BUTTON_E, button_event).on(BUTTON_E, button_event);

				// Get Carousel Items
		const url = `${FORMATTER.api_base_url()}/api/banners.json`;
		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				// console.log("Carousels", response.data.image_urls);
				setCarouselItems(response.data.image_urls);
				// response.data.image_urls.forEach((element, index) => { console.log(index) });
			})
			.catch(error => console.log(error.message));

        return () => {
            // console.log('Log out')
            socket.off(BUTTON_E)
            socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: BUTTON_E });
        }
    },[]);

	// const handleButtonOk = () => {
	// 		setShowAlert(false);
	// 		activate_button(socket);
	// }

	let timer = 10000; // set timer as 10 seconds

	const handleOnIdle = (event) => {
		setShowAlert(false); // close EmptyStockModal after 10 seconds
	}

	const { getRemainingTime } = useIdleTimer({
		timeout: timer,
		onIdle: handleOnIdle
	});

	const handleMouseDown = () => {
			setStart(new Date());
	}

	const handleMouseUp = (event) => {
		let btn = event.target.dataset.btn;
		// console.log("btn", start, btn);
		const minTime = 5000; 
		const maxTime = 10000;
		let delta;
		let end = new Date();
		delta = end - start;
		// console.log("Delta - " + delta);
		if (delta > minTime && delta < maxTime) {
			if (btn === "1") { setClickBtn1(true) }
			if (btn === "2") { 
				if(clickBtn1) { history.push(`/management/login`); }
				// console.log("BtnClicked", clickBtn1, btn);
			}
		}
	}

    return <div>
		<Button className="custom-t2 carousel-button" style={{top: "0", left: "0", opacity: "0", width: "200px", height: "200px"}} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} data-btn="1">Hidden Button</Button>
		<Button className="custom-t2 carousel-button" style={{top: "0", right: "0", opacity: "0", width: "200px", height: "200px"}} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} data-btn="2">Hidden Button</Button>
			{
				(carouselItems.length > 0) ?
					<Row>
						<Carousel style={{height: "100%"}}>  
						{
							carouselItems.map((element, index) => (
								<Carousel.Item interval={carouselInterval} key={index} className='carousel-container justify-content-center'  style={{width: "100%", objectFit: "contain"}}> 
									{/* <Row className='justify-content-center mb-3'> */}
									{/* </Row> */}
									{/* <Row className='justify-content-center'> */}
										<img src={`${FORMATTER.api_base_url()}${element}`} alt='Carousel Item' className='carousel-image'/>
									{/* </Row> */}
								</Carousel.Item>	
							))
						}
						</Carousel> 
					</Row>	
				:
				<Row>
					<Row className='justify-content-center mb-3'>
						<div className='p-2 align-self-center text-center'>
								<img src={logo} className='mini-logo2' alt='Logo' />
						</div>
					</Row>

					<Row className='justify-content-center mt-3'>
						<div className='p-2 text-center align-self-center machine-shop-div'>
							<span className='machine-shop-div-text'><strong>SILAHKAN MEMULAI DENGAN MENEKAN <br/> TOMBOL PRODUK YANG MAU DIPILIH</strong></span>
						</div>
					</Row>
				</Row>
			}
			<Modal show={showAlert} size="lg" centered>
				<Modal.Body>
					<Row className="w-100 justify-content-center text-center">
						<p className="text-uppsercase custom-t2">KEHABISAN STOK</p>
					</Row>
				</Modal.Body>
				{/* <Modal.Footer className="justify-content-center text-center">
					<Button variant="info" onClick={handleButtonOk} className="text-uppercase custom-t2">OK</Button>
				</Modal.Footer> */}
			</Modal>
		</div>;
}

export default MachineShop;