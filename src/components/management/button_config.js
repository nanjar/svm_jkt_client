import React from "react";
import { Link } from 'react-router-dom';
import '../../App.css';

class ButtonConfig extends React.Component {

	render() {
		return (
			<>
				<div className="vw-100 vh-100 d-flex">
					<div className="container">
						<div className="m-3">

							<div className="row col-12 justify-content-center">
								<h1 className="text-center text-uppercase">Press the button to configure</h1>
							</div>

							<div className="row col-12">
								<div className="row col-12">
									<div className="col-6 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center">
											<label className="lead font-weight-bold">Button</label>
										</div>
									</div>

									<div className="col-6">
										<div className="row col-12 d-flex flex-column justify-content-center">
											<div className="p-2 align-self-center">
												<label className="lead font-weight-bold">Select Product</label>
											</div>
										</div>
									</div>
								</div>


								<div className="row col-12">
									<div className="col-6 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center">
											<input type="text"  value="" className="form-control form-control-lg" pattern="" inputmode="" placeholder="Button Name"></input>
										</div>
									</div>

									<div className="col-6 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center">
											<select className="form-control form-control-lg" aria-label="Select product ...">
												<option value="Ford">Beng Beng</option>
												<option value="Volvo">Cha Cha</option>
												<option value="Fiat">Chic Choc</option>
											</select>
										</div>
									</div>
								</div>

								<div className="row col-12 d-flex justify-content-center">
									<div className="text-center col p-2 align-self-center">
										<Link to="/management" className="btn btn-lg btn-warning">
											<h2 className="text-center text-uppercase">Cancel</h2>
										</Link>
									</div>

									<div className="text-center col p-2 align-self-center">
										<button className="btn btn-lg btn-info text-uppercase"><h3>Confirm</h3></button>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</>
		);
	}

}

export default ButtonConfig;