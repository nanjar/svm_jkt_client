import React from "react";
import { Link } from 'react-router-dom';
import '../../../App.css';

class ButtonConfig extends React.Component {

	render() {
		
		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">

							<div className="row col-12 justify-content-center">
								<h1 className="text-center text-uppercase display-4">Press the button to configure</h1>
							</div>

							<div className="row">
								<div className="row col-12 d-flex justify-content-center p-5">
									<Link to="/management/button_mapping" className="btn btn-lg btn-info m-3">
										<h2 className="text-center text-uppercase display-4">Button 1</h2>
									</Link>
									<Link to="/management/button_mapping" className="btn btn-lg btn-info m-3">
										<h2 className="text-center text-uppercase display-4">Button 2</h2>
									</Link>
									<Link to="/management/button_mapping" className="btn btn-lg btn-info m-3">
										<h2 className="text-center text-uppercase display-4">Button 3</h2>
									</Link>
									<Link to="/management/button_mapping" className="btn btn-lg btn-info m-3">
										<h2 className="text-center text-uppercase display-4">Button 4</h2>
									</Link>
									<Link to="/management/button_mapping" className="btn btn-lg btn-info m-3">
										<h2 className="text-center text-uppercase display-4">Button 5</h2>
									</Link>
								</div>

								<div className="row col-12 d-flex justify-content-center mb-4">
									<div className="text-center col p-2 align-self-center">
										<Link to="/management" className="btn btn-lg btn-warning">
											<h2 className="text-center text-uppercase display-4">Cancel</h2>
										</Link>
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