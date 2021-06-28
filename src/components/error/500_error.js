import React from "react";
import '../../App.css';
import { Container, Row } from "react-bootstrap";

const ISError = () => {
	return <Container fluid>
		<Row className="justify-content-center">
			<p className="text-center text-uppercase custom-t0">Kesalahan yang tidak diduga!</p>
		</Row>
	</Container>
}

export default ISError;