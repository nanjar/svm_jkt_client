import { useContext, useEffect } from 'react';
import { SocketContext } from '../../services/socket';
import SERVER_REQ  from '../../helpers/Request';
import {useHistory} from 'react-router-dom';
import logo from '../../assets/static_images/Logo.png';
import btn_press from '../../assets/static_images/button.gif';
import { Container, Row, Col, Button } from 'react-bootstrap';

const MachineShop = (props) => {
    const socket = useContext(SocketContext);
    const history = useHistory();
    useEffect(() => {
        let button_pressed = false;
        socket.on('button_pressed', async (data) => {
            data = JSON.parse(data);
            console.log(data);
            if(button_pressed)
                return;
            button_pressed = true;
            const button = data.button_no
            if(button === 0 )
                return;
            socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: 'button_pressed' });
            console.log('pressed')
            const button_req = await SERVER_REQ.get(`http://vending.smartvending.com/api/buttons/${button}.json`);
            console.log(button_req);
            const button_detail = button_req.response.data;
            const product_detail = {name: button_detail.product.name, url: button_detail.product.image_url}
            const url_params = new URLSearchParams(product_detail);
            console.log(button_detail, `/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`);
            history.push(`/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`)
        })
        return () => {
            socket.off('button_pressed')
        }
    }, [history, socket]);

		let start, end;
		const handleMouseDown = () => {
			start = new Date();
		}
	
		const handleMouseUp = () => {
			const minTime = 5000; 
			const maxTime = 10000;
			let delta;
			end = new Date();
			delta = end - start;
			console.log("Delta - " + delta);
			if (delta > minTime && delta < maxTime) {
				history.push(`/management/login`);
			}
		}

    return <Container fluid>
				<Button className="custom-t2" style={{position: "absolute", top: "0px", left: "0px", opacity: "0"}} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>Hidden Button</Button>
        <Row>
            <Col lg={7} className='justify-content-center'>
                <div className='p-2 align-self-center'>
                    <img src={logo} className='img-thumbnail border-0' alt='Logo' />
                </div>
            </Col>
            <Col lg={5} className='justify-content-center'>
                <div className='p-2 align-self-center'>
                  <img src={btn_press} className='img-thumbnail border-0' alt='TEKAN TOMBOL UNTUK MEMULAI'></img>
                </div>
            </Col>
        </Row>
        <Row className='justify-content-center mt-4'>
            <p className='text-center custom-t1'><strong>SILAHKAN MEMULAI DENGAN MENEKAN TOMBOL PRODUK YANG MAU DIPILIH</strong></p>
        </Row>
    </Container>;
}

export default MachineShop;