import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';

const Management = (props) => {
	return <Container fluid>
		<Row className="mt-1">
			<Col lg={6}><span className="text-uppercase custom-t2">SUHU PERANGKAT - 33 C</span></Col> {/* device temp */}
			<Col lg={6}><span className="text-uppercase float-end custom-t2">SUHU MESIN - 33 C</span></Col> {/* machine temp */}
		</Row> 
		<Row>
			<Col lg={6} className="bg-smvprimary">
				<Link to="/management/auto_topup" className="btn btn-lg btn-block set-wh text-uppercase">
					<h1 className="display-2 set-mtop">TOP UP OTOMATIS</h1> {/* auto topup */}
				</Link>
			</Col>

			<Col lg={6} className="bg-smvsecondary">
				<Link to="/management/manual_topup" className="btn btn-lg btn-block set-wh text-uppercase">
					<h1 className="display-2 set-mtop">TOP UP MANUAL</h1> {/* manual topup */}
				</Link>
			</Col>
		</Row>
		<Row>
			<Col lg={6} className="bg-smvsecondary">
				{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>Konfigurasi Tombol</h1></button> */}
				<Link to="/management/button_config" className="btn btn-lg btn-block set-wh text-uppercase">
					<h1 className="display-2 set-mtop2">TOMBOL KONFIGURASI</h1> {/* button configuration */}
				</Link>
			</Col>

			<Col lg={6} className="bg-smvprimary">
				{/* <button className="btn btn-lg btn-info btn-block text-uppercase"><h1>keluar</h1></button> */}
				<Link to="/" className="btn btn-lg btn-block set-wh text-uppercase">
					<h1 className="display-2 set-mtop">KELUAR</h1> {/* logout */}
				</Link>
			</Col>
		</Row>
	</Container>;
}

export default Management;