import { Button, Container, Image, Row, Col } from 'react-bootstrap';

const Product = (props) => {
	const {products, handleCancelBtn, selectedProduct, handleOnRadioChange = () => {}, handleSubmitBtn = () => {}} = props;
	// const [confirmBtn, setConfirmBtn] = useState(false);
	// function handleConfirmBtn(){
	//     setConfirmBtn(true);
	// }
	return <Container fluid className="m-3">
		<Row className="justify-content-center">
			<h1 className="text-center text-uppercase display-4 mb-4">Choose the product to map</h1>
		</Row>
		<Row>
			{
				products.map((product, index) => (
						<Col key={index} className="radio-product m-3">
							<input type="radio" id={product.id} data-name={product.name} data-url={`${process.env.REACT_APP_API}${product.image_url}`} name="radioProduct" onChange={handleOnRadioChange}/>
							<label id={"lbl-" + product.id} className={`radio-img mb-4 ${selectedProduct === product.id ? 'card-checked' : ''}`} htmlFor={product.id}> 
								<div id={"card_" + index} className="card">
									<div className="card-body text-center">
										<Image
												src={`${process.env.REACT_APP_API}${product.image_url}`}
												className="btn-thumbnail mt-3"
												alt={product.name}
										/>
											<p className="custom-t3 text-uppercase">{product.name}</p>
									</div>
								</div>
							</label>
						</Col>
				))
			}
		</Row>
		<div className="text-center mt-4">
				<Button type="button" className="btn btn-lg btn-warning text-uppercase custom-t2 m-2" onClick={handleCancelBtn}>
					Cancel
				</Button>
				<Button type="button" className="btn btn-lg btn-info text-uppercase custom-t2 m-2" onClick={handleSubmitBtn}>
					Submit
				</Button>
		</div>
	</Container>;
}

export default Product;