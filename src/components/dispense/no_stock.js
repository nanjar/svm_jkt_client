import React from "react";
import '../../App.css';

class NoStock extends React.Component {
	render() {
		return (
      <>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12 d-flex flex-column justify-content-center">
								<div className="p-2 align-self-center mb-3">
									<h1 className="text-center display-2">Barang yang ada pilih sedang habis!</h1>
								</div>
								<div className="p-2 align-self-center">
									<h1 className="text-center display-3">Silahkan mencoba item lainnya!</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
    	);
	}
}

export default NoStock;