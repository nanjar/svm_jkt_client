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
			<Row className="justify-content-center text-center">
				<p className="text-center text-uppercase custom-t1">TEKAN TOMBOL UNTUK PRODUK</p> {/* press button to map */}
				<br/>
			</Row>
			<Row className="justify-content-center text-center">
				{
					products.map((data, index) => (
						(data.product) ?
							<Col key={index} lg={3} className="text-uppercase border background-Color">
								<p className="custom-t2">TOMBOL {data.uuid}</p>
								<Image
									src={`${FORMATTER.api_base_url()}${data.product.image_url}`}
									className="product-thumbnail"
									alt={data.name}
								/>
							</Col>
						: ""
					))
				}
			</Row>
			<br/>
			<Row className="justify-content-center text-center mt-2 pull-right">
				<Col lg={{ span: 2, offset: 10 }}> 
					<Button variant="warning" className="text-uppercase custom-t1" onClick={props.handleCancelBtn}>
						BATAL 
					</Button> {/* cancel */}
				</Col>
			</Row>
	</div>
}

export default LandingPage;