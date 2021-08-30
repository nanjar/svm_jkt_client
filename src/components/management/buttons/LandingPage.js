import { useEffect, useState } from 'react';
import SERVER_REQ from '../../../helpers/Request';
import FORMATTER from '../../../helpers/Formatter';
import { Button, Container, Row, Col, Image } from 'react-bootstrap';

const LandingPage = (props) => {
	const [products, setProducts] = useState([]);

	const getData = async() => {
		const products_req = await SERVER_REQ.get(`/api/buttons.json`);
		setProducts(products_req.response.data);
	}

	useEffect(() => {
		getData();
	}, []);

	// console.log("LP", products);

	return <div>
			<Row className="justify-content-center mt-3 mb-3">
				<Col lg={10}> 
					<p className="text-uppercase custom-t1" style={{ paddingLeft: "4vw" }}>TEKAN TOMBOL UNTUK PRODUK</p> {/* press button to map */}
				</Col>
				<Col lg={2}> 
					<Button variant="warning" className="text-uppercase custom-t1 p-3" onClick={props.handleCancelBtn}>
						BATAL 
					</Button> {/* cancel */}
				</Col>
			</Row>
			<div className="scroll-div">
				<Row>
					{
						products.map((data, index) => (
							(data.product) ?
								<Col key={index} lg={3} className="text-uppercase border">
									<p className="custom-t2">TOMBOL {data.uuid}</p>
									<Image
										src={`${FORMATTER.api_images()}${data.product.image_url}`}
										className="product-thumbnail"
										alt={data.name}
									/>
								</Col>
							: ""
						))
					}
				</Row>
			</div>
			<br/>
			{/* <Row className="justify-content-center text-center mt-2 pull-right">
				<Col lg={{ span: 2, offset: 10 }}> 
					<Button variant="warning" className="text-uppercase custom-t1" onClick={props.handleCancelBtn}>
						BATAL 
					</Button> {/* cancel 
				</Col>
			</Row> */}
	</div>
}

export default LandingPage;