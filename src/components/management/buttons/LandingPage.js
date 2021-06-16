import { Row } from 'react-bootstrap';

const LandingPage = (props) => {
	return <Row>
		<Row className="justify-content-center">
			<h1 className="text-center text-uppercase display-2">Press button to map</h1>
			<br/>
			<button className="btn btn-lg btn-warning m-3 text-center text-uppercase custom-t1" onClick={props.handleCancelBtn}>
				Cancel
			</button>
		</Row>
	</Row>
}

export default LandingPage;