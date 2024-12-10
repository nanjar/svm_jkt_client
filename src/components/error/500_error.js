import React from "react";
import '../../App.css';
import { Container, Row } from "react-bootstrap";

const ISError = () => {
	return <div className="vw-100 vh-100 d-flex align-items-center background-Img">
		<Container fluid>
			<Row className="justify-content-center">
				<p className="text-center text-uppercase custom-t0">Kesalahan yang tidak diduga!</p>
			</Row>
		</Container>
	</div>
}

export default ISError;