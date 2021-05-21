import React from "react";
import { Link } from 'react-router-dom'
import logo from '../../assets/static_images/Logo.png';
import btn_press from '../../assets/static_images/button.gif';
import '../../App.css';

class Home extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			data: [],
			machine_code: ""
		}
	}

	componentDidMount() {
		const url = "/home";

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				console.log(response);
				this.setState({ 
					data: response.data,
					machine_code: response.machine_code
				});
			})
			.catch(() => this.props.history.push("/"));
	}


	machineSetup = () => {
		const machine_code = this.state.machine_code;
		let code;
		if (machine_code) {
			code = <h1 className='text-center display-1 align-self-center'>MACHINE CODE - <span class="custom-t0"><strong> {machine_code} </strong></span></h1>;
		} else {
			code = <h1 className='text-center display-1 align-self-center'><strong>Machine Setup ... </strong></h1>;
		}
		return  <div className="m-3">
			<div className='row d-flex justify-content-center'>
				<div className='spinner-border custom-spinner' role='status'>
					<span className='sr-only'>Setting up ...</span>
				</div>
				<br />
			</div>
			<div className='row col-12 justify-content-center mt-4'>{code}</div>
		</div>;
	}

	machineStart = () => {
		return <div className="m-3">
			<div className='row col-12'>
				<div className='col-7 d-flex flex-column justify-content-center'>
					<div className='p-2 align-self-center'>
						<img src={logo} className='img-thumbnail border-0' alt='Logo' />
					</div>
				</div>
				<div className='col-5 d-flex flex-column justify-content-center'>
					<div className='p-2 align-self-center'>
						<Link to='/cart/1'>
							<img src={btn_press} className='img-thumbnail border-0' alt='TEKAN TOMBOL UNTUK MEMULAI'></img>
						</Link>
					</div>
				</div>
			</div>
			<div className='row col-12 justify-content-center mt-4'>
				<h1 className='text-center display-3'><strong>SILAHKAN MEMULAI DENGAN MENEKAN TOMBOL PRODUK YANG MAU DIPILIH</strong></h1>
			</div>
		</div>;
	}

	machine = () => {
		const config_statuses = this.state.data;
		if (config_statuses.length !== 0) {
			return <this.machineSetup />;
		}
		return <this.machineStart />;
	}	

	render () {
		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<this.machine />
					</div>
				</div>
			</>
		);
	}
}

export default Home;