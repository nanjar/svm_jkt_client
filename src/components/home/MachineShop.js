import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../services/socket';
import SERVER_REQ  from '../../helpers/Request';
import FORMATTER  from '../../helpers/Formatter';
import {useHistory} from 'react-router-dom';
import logo from '../../assets/static_images/Logo.png';
import { Row, Button, Modal } from 'react-bootstrap';
// import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Slider from 'react-slick';
import '../../assets/css/slick-carousel.css';
const BUTTON_E = "button_pressed";
// eslint-disable-next-line

const MachineShop = () => {
		const [showAlert, setShowAlert] = useState(false);
		const socket = useContext(SocketContext);
		const history = useHistory();
		const [start, setStart] = useState(0);
		const [clickBtn1, setClickBtn1] = useState(false);
		const [carouselItems, setCarouselItems] = useState([]);
		// eslint-disable-next-line
		const [reloadPageInterval, setReloadPageInterval] = useState(null);

	const activate_button = () => {
		setTimeout(() => socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 50, reply_to: BUTTON_E }), 2000);
	}
    useEffect(() => {
        let button_pressed = false;
		// window.addEventListener('beforeunload', () => {
		// 	socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 300, reply_to: 'button_pressed' });
		// 	alert('send command')
		// })
		if(socket){
			// socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 50, reply_to: BUTTON_E });
			activate_button();
			const button_event = async (data) => {
				data = JSON.parse(data);
					socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 300, reply_to: 'button_pressed' });
				// console.log(data);
				if(button_pressed)
					return;
				button_pressed = true;
				if (button_pressed) { setShowAlert(false); } // close EmptyStockModal at the button pressed
				const button = data.button_no
				if(button === 0 )
					return;
				// console.log('pressed')
				const button_req = await SERVER_REQ.get(`/api/buttons/${button}.json`);
				// console.log(button_req);
				const button_response = button_req.response
				// console.log("button response", button_response);
				if(!button_response.success){
					button_pressed=false;
					setShowAlert(true); // out of stock alert
					setTimeout(function(){ setShowAlert(false); console.log("inTimeout") }, 5000);
					setTimeout( () => activate_button(), 500);
					return;
				}
				const button_detail = button_req.response.data;
				
				const product_detail = {name: button_detail.product.name, url: button_detail.product.image_url, slots: button_detail.slot_available}
				console.log("Product Details", product_detail);
				const url_params = new URLSearchParams(product_detail);
				// console.log(button_detail, `/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`);
				history.push(`/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`)
			}
			socket.off(BUTTON_E, button_event).on(BUTTON_E, button_event);

			// button status
		}

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
		
			setReloadPageInterval(prev => {
				return setInterval(()=>{
					window.location = "/";
				}, 300000)
			})

        return () => {
            // console.log('Log out')
            socket.off(BUTTON_E);
				socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: BUTTON_E });
            // socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: BUTTON_E });
			setReloadPageInterval(prev => {
				clearInterval(prev);
				return null;
			})
        }
		// eslint-disable-next-line
    },[]);

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

	const sliderSettings = {
		dots: false,
		infinite: true,
		autoplaySpeed: 10000,
		autoplay: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false
	}

    return <div>
		<Button className="custom-t2 carousel-button" style={{top: "0", left: "0", opacity: "0", width: "200px", height: "200px"}} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} data-btn="1">Hidden Button</Button>
		<Button className="custom-t2 carousel-button" style={{top: "0", right: "0", opacity: "0", width: "200px", height: "200px"}} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} data-btn="2">Hidden Button</Button>
			{
				(carouselItems.length > 0) ?
					<Row className="slide-container">
						<Slider {...sliderSettings} >
							{
								carouselItems.map((slideImage, index)=> (
									<div className="each-slide" key={index}>
										<div style={{'backgroundImage': `url(${FORMATTER.api_images()}${slideImage})`, height: '100vh', backgroundRepeat: 'no-repeat, repeat', backgroundSize: '100% 100%'}}></div>
									</div>
								))
							}
						</Slider>
						{/* <Slide arrows={false} duration={10000} autoplay={true}>
							{
								carouselItems.map((slideImage, index)=> (
									<div className="each-slide" key={index}>
										<div style={{'backgroundImage': `url(${FORMATTER.api_images()}${slideImage})`, height: '100vh', backgroundRepeat: 'no-repeat, repeat', backgroundSize: '100% 100%'}}></div>
									</div>
								))
							} 
						</Slide> */}
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
						<p className="text-uppsercase custom-t2">MAAF STOK TIDAK TERSEDIA</p>
					</Row>
				</Modal.Body>
				{/* <Modal.Footer className="justify-content-center text-center">
					<Button variant="info" onClick={handleButtonOk} className="text-uppercase custom-t2">OK</Button>
				</Modal.Footer> */}
			</Modal>
		</div>;
}

export default MachineShop;