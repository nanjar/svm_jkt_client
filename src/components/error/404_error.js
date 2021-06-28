import React from "react";
import '../../App.css';
import { Container, Row } from "react-bootstrap";

const NotFoundError = () => {
	return <Container fluid>
		<Row className="justify-content-center">
			<p className="text-center text-uppercase custom-t0">Tidak ditemukan!</p>
		</Row>
	</Container>
}

export default NotFoundError;