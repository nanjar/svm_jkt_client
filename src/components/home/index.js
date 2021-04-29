import React from "react";
import { Link } from 'react-router-dom'
import logo from '../../assets/static_images/Logo.png';
import btn_press from '../../assets/static_images/button.gif';
import '../../App.css';

class Home extends React.Component {
	render () {
		return (
			<>
				<div className="vw-100 vh-100 d-flex align-items-center">
					<div className="container-fluid">
						<div className="m-3">

							<div className="row col-12">
								<div className="col-7 d-flex flex-column justify-content-center">
									<div className="p-2 align-self-center">
										<img src={logo} className="img-thumbnail border-0" alt="Logo" />
									</div>
								</div>

								<div className="col-5 d-flex flex-column justify-content-center">
									<div className="p-2 align-self-center">
										<Link to="/cart/1">
										<img src={btn_press} className="img-thumbnail border-0" alt="TEKAN TOMBOL UNTUK MEMULAI"></img>
										</Link>
									</div>
								</div>
							</div>

							<div className="row col-12 justify-content-center mt-4">
								<h1 className="text-center display-3"><strong>SILAHKAN MEMULAI DENGAN MENEKAN TOMBOL PRODUK YANG MAU DIPILIH</strong></h1>
							</div>

						</div>
					</div>
				</div>
			</>
		);
	}
}

export default Home;