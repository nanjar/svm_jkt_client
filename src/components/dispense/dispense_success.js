import React from "react";
import '../../App.css';
import img_down from '../../assets/static_images/down.gif';

class DispenseSuccess extends React.Component {
	render() {
		return (
      		<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">
							<div className="row col-12 d-flex flex-column justify-content-center">
										<div className="p-2 align-self-center mb-3">
											<h1 className="text-center display-2">Pembelian Selesai</h1>
										</div>
										<div className="p-2 align-self-center mb-3">
											<h1 className="text-center display-3">Silahkan ambil pembelian anda</h1>
										</div>
										<div className="p-2 align-self-center mb-3">
											<img src={img_down} className="img-thumbnail border-0" alt="Silahkan ambil pembelian anda"></img>
										</div>
										<div className="p-2 align-self-center">
											<h1 className="text-center display-3">Terima Kasih atas pembeliannya!</h1>
										</div>
								</div>
							</div>
						</div>
				</div>
			</>
    	);
	}
}

export default DispenseSuccess;