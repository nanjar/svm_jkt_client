import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';

const Management = (props) => {
	return <Row>
		<div className="col-6 bg-smvprimary">
			{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>Isi Ulang Otomatis</h1></button> */}
			<Link to="/management/auto_topup" className="btn btn-lg btn-block set-wh text-uppercase">
				<h1 className="display-2 set-mtop">Auto Topup</h1>
			</Link>
		</div>

		<div className="col-6 bg-smvsecondary">
			{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>isi ulang secara manual</h1></button> */}
			<Link to="/management/manual_topup" className="btn btn-lg btn-block set-wh text-uppercase">
				<h1 className="display-2 set-mtop">Manual Topup</h1>
			</Link>
		</div>
		<div className="col-6 bg-smvsecondary">
			{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>Konfigurasi Tombol</h1></button> */}
			<Link to="/management/button_config" className="btn btn-lg btn-block set-wh text-uppercase">
				<h1 className="display-2 set-mtop2">Button Configuration</h1>
			</Link>
		</div>

		<div className="col-6 bg-smvprimary">
			{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>keluar</h1></button> */}
			<Link to="/management/logout" className="btn btn-lg btn-block set-wh text-uppercase">
				<h1 className="display-2 set-mtop">Logout</h1>
			</Link>
		</div>
	</Row>;
}

export default Management;