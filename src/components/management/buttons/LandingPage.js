import { useEffect, useState } from 'react';
import SERVER_REQ from '../../../helpers/Request';
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

	console.log("LP", products);

	return <Container>
		<Row className="justify-content-center text-center">
			<p className="text-center text-uppercase custom-t1">TEKAN TOMBOL UNTUL PEMETAAN</p> {/* press button to map */}
			<br/>
		</Row>
		<Row className="justify-content-center text-center">
			{
				products.map((data, index) => (
					(data.product) ?
						<Col key={index} lg={4} className="text-uppercase border">
							<p className="custom-t2">TOMBOL {data.uuid}</p>
							<Image
								src={`${process.env.REACT_APP_API}${data.product.image_url}`}
								className="product-thumbnail"
								alt={data.name}
							/>
						</Col>
					: ""
				))
			}
		</Row>
		<Row className="justify-content-center text-center mt-4">
			<Col lg={2}> 
				<Button variant="warning" className="text-uppercase custom-t1" onClick={props.handleCancelBtn}>
					BATAL 
				</Button> {/* cancel */}
			</Col>
		</Row>
	</Container>
}

export default LandingPage;