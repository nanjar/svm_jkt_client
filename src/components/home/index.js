import React from "react";
import MachineSetup from './MachineShop';
import logo from '../../assets/static_images/Logo.png';
import btn_press from '../../assets/static_images/button.gif';
import '../../App.css';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.socket = props.socket;
		this.state = {
			reply_status: false,
			machine_code: ""
		}
	}

	componentDidMount() {
		const url = "/api/home";
		socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 300, reply_to: 'button_pressed' })
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
				<div className='spinner-border custom-spinner' role='status'>
					<span className='sr-only'>Setting up ...</span>
				</div>
				<br />
			</div>
			<div className='row col-12 justify-content-center mt-4'>{code}</div>
		</div>;
	}

	Machine = () => {
		console.log(this.state.reply_status);
		const reply_status = this.state.reply_status;
		const Machine = reply_status ? this.MachineStart : MachineSetup;
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

export default Home;