import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';

const Management = (props) => {
	return <Container fluid className="m-0">
		<Row>
			<Col lg={{span:3}}><p className="text-uppercase custom-t3">Device Temp - 33 C</p></Col>
			<Col lg={{span:3, offset: 6}}><p className="text-uppercase custom-t3">Machine Temp - 33 C</p></Col>
		</Row>
		<Row>
			<Col lg={6} className="bg-smvprimary">
				{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>Isi Ulang Otomatis</h1></button> */}
				<Link to="/management/auto_topup" className="btn btn-lg btn-block set-wh text-uppercase">
					<h1 className="display-2 set-mtop">Auto Topup</h1>
				</Link>
			</Col>

			<Col lg={6} className="bg-smvsecondary">
				{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>isi ulang secara manual</h1></button> */}
				<Link to="/management/manual_topup" className="btn btn-lg btn-block set-wh text-uppercase">
					<h1 className="display-2 set-mtop">Manual Topup</h1>
				</Link>
			</Col>
		</Row>
		<Row>
			<Col lg={6} className="bg-smvsecondary">
				{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>Konfigurasi Tombol</h1></button> */}
				<Link to="/management/button_config" className="btn btn-lg btn-block set-wh text-uppercase">
					<h1 className="display-2 set-mtop2">Button Configuration</h1>
				</Link>
			</Col>

			<Col lg={6} className="bg-smvprimary">
				{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>keluar</h1></button> */}
				<Link to="/" className="btn btn-lg btn-block set-wh text-uppercase">
					<h1 className="display-2 set-mtop">Logout</h1>
				</Link>
			</Col>
		</Row>
	</Container>;
}

export default Management;