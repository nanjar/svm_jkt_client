import { Button, Container, Row, Col } from 'react-bootstrap';

const LandingPage = (props) => {
	return <Container>
		<Row className="justify-content-center text-center">
			<p className="text-center text-uppercase custom-t1">TEKAN TOMBOL UNTUL PEMETAAN</p> {/* press button to map */}
			<br/>
		</Row>
		<Row className="justify-content-center text-center">
			<Col lg={2}> 
				<Button variant="warning" className="text-uppercase custom-t1" onClick={props.handleCancelBtn}>
					BATAL 
				</Button> {/* cancel */}
			</Col>
		</Row>
	</Container>
}

export default LandingPage;