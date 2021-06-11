import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SocketContext } from '../../services/socket';
import { REQUEST } from '../../helpers';
import {useHistory} from 'react-router-dom';
import logo from '../../assets/static_images/Logo.png';
import btn_press from '../../assets/static_images/button.gif';
export default MachineStart = () => {
    const socket = useContext(SocketContext);
    const history = useHistory();
    useEffect(() => {
        socket.on('button_pressed', (data) => {
            if(data.no === 0 )
                return;
            socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 300, reply_to: 'button_pressed' });
            const button_req = await REQUEST.get(`/api/buttons/${data.no}.json`);
            const button_detail = button_req.reponse.data;
            history.push(`/sales/${button_detail.product.id}/${button_detail.price}`)
        })
        return () => {
            socket.offAny('button_pressed')
        }
    })([]);
    return <div className="m-3">
        <div className='row col-12'>
            <div className='col-7 d-flex flex-column justify-content-center'>
                <div className='p-2 align-self-center'>
                    <img src={logo} className='img-thumbnail border-0' alt='Logo' />
                </div>
            </div>
            <div className='col-5 d-flex flex-column justify-content-center'>
                <div className='p-2 align-self-center'>
                    <Link to='/sale'>
                         <img src={btn_press} className='img-thumbnail border-0' alt='TEKAN TOMBOL UNTUK MEMULAI'></img>
                     </Link>
                </div>
            </div>
        </div>
        <div className='row col-12 justify-content-center mt-4'>
            <h1 className='text-center display-3'><strong>SILAHKAN MEMULAI DENGAN MENEKAN TOMBOL PRODUK YANG MAU DIPILIH</strong></h1>
        </div>
    </div>;
}