import { useContext, useEffect } from 'react';
import { SocketContext } from '../../services/socket';
import SERVER_REQ  from '../../helpers/Request';
import {useHistory} from 'react-router-dom';
import logo from '../../assets/static_images/Logo.png';
import btn_press from '../../assets/static_images/button.gif';

const MachineShop = () => {
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
    return <div className="m-3">
        <div className='row col-12'>
            <div className='col-7 d-flex flex-column justify-content-center'>
                <div className='p-2 align-self-center'>
                    <img src={logo} className='img-thumbnail border-0' alt='Logo' />
                </div>
            </div>
            <div className='col-5 d-flex flex-column justify-content-center'>
                <div className='p-2 align-self-center'>
                  <img src={btn_press} className='img-thumbnail border-0' alt='TEKAN TOMBOL UNTUK MEMULAI'></img>
                </div>
            </div>
        </div>
        <div className='row col-12 justify-content-center mt-4'>
            <h1 className='text-center display-3'><strong>SILAHKAN MEMULAI DENGAN MENEKAN TOMBOL PRODUK YANG MAU DIPILIH</strong></h1>
        </div>
    </div>;
}

export default MachineShop;