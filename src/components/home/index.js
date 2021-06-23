import React from "react";
import MachineShop from './MachineShop';
import '../../App.css';
import { Spinner } from 'react-bootstrap';

import {SocketContext} from '../../services/socket';

class Home extends React.Component {
	constructor(props) {
		super(props);
		// this.socket = SocketContext._currentValue;
		// this.socket = props.socket;
		this.state = {
			reply_status: false,
			machine_code: "",
			start: "",
			end: ""
		}
	}

	componentDidMount() {
		this.context.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 200, reply_to: 'button_pressed' })
		const url = `${process.env.REACT_APP_API}/api/home.json`;
		console.log(url)
		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				this.setState({
					reply_status: response.success,
					machine_code: response.machine_code
				});
			})
			.catch(() => this.props.history.push("/"));
	}

	componentWillUnmount(){
		this.context.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 300, reply_to: 'button_pressed' })
	}

	MachineSetup = () => {
		const machine_code = this.state.machine_code;
		let code;
		if (machine_code) {
			code = <h1 className='text-center display-1 align-self-center'>MACHINE CODE - <span className="custom-t0"><strong> {machine_code} </strong></span></h1>;
		} else {
			code = <h1 className='text-center display-1 align-self-center'><strong>Machine Setup ... </strong></h1>;
		}
		return <div className="m-3">
			<div className='row d-flex justify-content-center'>
				<Spinner animation="border" className="custom-spinner" />
				<br />
			</div>
			<div className='row col-12 justify-content-center mt-4'>{code}</div>
		</div>;
	}

	Machine = () => {
		const reply_status = this.state.reply_status;
		const Machine = reply_status ? MachineShop : this.MachineSetup;
		return <Machine />
	}

	render() {
		const Machine = this.Machine;
		return (
			<div className="vw-100 vh-100 d-flex align-items-center">
				<div className="container-fluid">
					<Machine />
				</div>
			</div>
		);
	}
}

Home.contextType = SocketContext;

export default Home;