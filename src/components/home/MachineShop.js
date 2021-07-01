import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../services/socket';
import SERVER_REQ  from '../../helpers/Request';
import {useHistory} from 'react-router-dom';
import logo from '../../assets/static_images/Logo.png';
import btn_press from '../../assets/static_images/button.gif';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';

const BUTTON_E = "button_pressed";
const activate_button = (socket) => {
	socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 1000, reply_to: BUTTON_E })
}
const MachineShop = () => {
	const [showAlert, setShowAlert] = useState(false);
    const socket = useContext(SocketContext);
    const history = useHistory();
    useEffect(() => {
        let button_pressed = false;
        socket.on('connect', function(){
            console.log('connected')
        })
		socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 1000, reply_to: BUTTON_E })
        socket.on('error', function(){
            console.log('error')
        });
        
        socket.on(BUTTON_E, async (data) => {
            data = JSON.parse(data);
            console.log(data);
            if(button_pressed)
                return;
            button_pressed = true;
            const button = data.button_no
            if(button === 0 )
                return;
            socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: BUTTON_E });
            console.log('pressed')
            const button_req = await SERVER_REQ.get(`/api/buttons/${button}.json`);
			console.log(button_req)
			const button_response = button_req.response
			if(!button_response.success){
				button_pressed=false;
				setShowAlert(true);
				return;
			}
            const button_detail = button_req.response.data;
			
            const product_detail = {name: button_detail.product.name, url: button_detail.product.image_url}
            const url_params = new URLSearchParams(product_detail);
            console.log(button_detail, `/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`);
            history.push(`/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`)
        })
        return () => {
            console.log('Log out')
            socket.off(BUTTON_E)
            socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: BUTTON_E });
        }
    },[]);
	const handleButtonOk = () => {
		setShowAlert(false);
		activate_button(socket);
	}

	const handleMouseDown = () => {
			// start = new Date();
			setStart(new Date());
	}
	const [start, setStart] = useState(0);
	const [clickBtn1, setClickBtn1] = useState(false);

	const handleMouseUp = (event) => {
		let btn = event.target.dataset.btn;
		console.log("btn", start, btn);
		const minTime = 5000; 
		const maxTime = 10000;
		let delta;
		let end = new Date();
		delta = end - start;
		console.log("Delta - " + delta);
		if (delta > minTime && delta < maxTime) {
			if (btn === "1") { setClickBtn1(true) }
			if (btn === "2") { 
				if(clickBtn1) { history.push(`/management/login`); }
				console.log("BtnClicked", clickBtn1, btn);
			}
		}
	}

    return <div className="vw-100 vh-100 d-flex align-items-center">
				<Container fluid>
					<Button className="custom-t2" style={{position: "absolute", top: "0px", left: "0px", opacity: "0", width: 200, height: 200}} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} data-btn="1">Hidden Button</Button>
					<Button className="custom-t2" style={{position: "absolute", top: "0px", right: "0px", opacity: "0", width: 200, height: 200}} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} data-btn="2">Hidden Button</Button>
					<Row>
							<Col lg={7} className='justify-content-center'>
									<div className='p-2 align-self-center text-center'>
											<img src={logo} className='img-thumbnail border-0' alt='Logo' />
									</div>
							</Col>
							<Col lg={5} className='justify-content-center'>
									<div className='p-2 align-self-center text-center'>
										<img src={btn_press} className='product-thumbnail border-0' alt='TEKAN TOMBOL UNTUK MEMULAI'></img>
									</div>
							</Col>
					</Row>
					<Row className='justify-content-center mt-4'>
							<p className='text-center custom-t1'><strong>SILAHKAN MEMULAI DENGAN MENEKAN TOMBOL PRODUK YANG MAU DIPILIH</strong></p>
					</Row>
			</Container>
			<Modal show={showAlert} size="lg" centered>
				<Modal.Body>
					<Row className="w-100 justify-content-center text-center">
						<p className="text-uppsercase custom-t2">KEHABISAN STOK</p>
					</Row>

				</Modal.Body>
				<Modal.Footer className="justify-content-center text-center">
					<Button variant="info" onClick={handleButtonOk} className="text-uppercase custom-t2">OK</Button>
				</Modal.Footer>
			</Modal>
		</div>;
}

export default MachineShop;