import { Button, Container, Row, Col } from 'react-bootstrap';

const LandingPage = (props) => {
	return <Container>
		<Row className="justify-content-center text-center">
			<p className="text-center text-uppercase custom-t1">Press button to map</p>
			<br/>
		</Row>
		<Row className="justify-content-center text-center">
			<Col lg={2}>
				<Button variant="warning" className="text-uppercase custom-t1" onClick={props.handleCancelBtn}>
					Cancel
				</Button>
			</Col>
		</Row>
	</Container>
}

export default LandingPage;