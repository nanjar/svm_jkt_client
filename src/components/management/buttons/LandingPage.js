import { Button, Container, Row } from 'react-bootstrap';

const LandingPage = (props) => {
	return <Container>
		<Row className="justify-content-center">
			<h1 className="text-center text-uppercase display-2">Press button to map</h1>
			<br/>
		</Row>
		<Row className="justify-content-center">
			<Button variant="warning" className="m-3 text-center text-uppercase custom-t1" onClick={props.handleCancelBtn}>
				Cancel
			</Button>
		</Row>
	</Container>
}

export default LandingPage;