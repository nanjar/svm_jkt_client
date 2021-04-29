import React from "react";
import '../../App.css';

class Ovo extends React.Component {
	render() {
		return (
      		<>
				<div className="vw-100 vh-100 d-flex align-items-center">
						<div className="container-fluid">
							<div className="m-3">
								<div className="row col-12 d-flex flex-column justify-content-center">

									<div className="p-2 align-self-center mb-3">
										<h1 className="text-center display-3">Metoda pembayaran masih belum bisa dipakai saat ini</h1>
										<br/>
									</div>
									<div className="p-2 align-self-center mb-3">
										<h1 className="text-center display-4">Kita sedang berusaha keras untuk meng-integrasi OVO dengan mesin ini!</h1>
									</div>
									<div className="p-2 align-self-center">
										<h1 className="text-center display-4">Terima kasih atas kesabaran anda</h1>
									</div>

								</div>
							</div>
						</div>
				</div>
			</>
    	);
	}
}

export default Ovo;