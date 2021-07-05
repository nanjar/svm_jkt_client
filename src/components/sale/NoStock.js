import React from "react";
import '../../App.css';
import { Row, Container } from 'react-bootstrap';
import { useIdleTimer } from 'react-idle-timer';

const NoStock = (props) => {
	const timer = 10000; //  10 seconds
	
	const handleOnAction = (event) => {
		console.log("user did something", event);
		console.log("remaining time 1 ", getRemainingTime());
	}
	
	const handleOnActive = (event) => {
		console.log("user is active", event);
	}
	
	const handleOnIdle = (event) => {
		console.log("user is idle", event);
		props.history.push("/");
	}
	
	const { getRemainingTime } = useIdleTimer({
		timeout: timer,
		onIdle: handleOnIdle,
		onActive: handleOnActive,
		onAction: handleOnAction
	});

	return (<div className="vw-100 vh-100 d-flex align-items-center">
		<Container fluid className="text-uppercase">
			<Row className="justify-content-center text-uppercase m-3">
				<div className="p-2 align-self-center mb-3">
					{/* the item you have selected is out of stock! */}
					<p className="text-center custom-t0">barang yang ada pilih sedang habis!</p>
				</div>
				<div className="p-2 align-self-center">
					{/* feel free to try other items! */}
					<p className="text-center custom-t0">slahkan mencoba item lainnya!</p>
				</div>
			</Row>
		</Container>
	</div>);
}

export default NoStock;