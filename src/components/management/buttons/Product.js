import { Button, Container, Image, Row, Col } from 'react-bootstrap';

const Product = (props) => {
	const {products, handleCancelBtn, selectedProduct, handleOnRadioChange = () => {}, handleSubmitBtn = () => {}} = props;
	// const [confirmBtn, setConfirmBtn] = useState(false);
	// function handleConfirmBtn(){
	//     setConfirmBtn(true);
	// }
	return <Container fluid className="m-3">
		<Row className="justify-content-center">
			<h1 className="text-center text-uppercase display-4 mb-4">PILIH PRODUK UNTUK PEMETAAN</h1> {/* Choose the product to map */}
		</Row>
		<Row className="justify-content-center">
			{
				products.map((product, index) => (
					<Col key={index} lg={3} className="radio-product m-3">
						<input type="radio" id={product.id} data-name={product.name} data-url={`${FORMATTER.api_base_url()}${product.image_url}`} name="radioProduct" onChange={handleOnRadioChange}/>
						<label id={"lbl-" + product.id} className={`radio-img mb-4 ${selectedProduct === product.id ? 'card-checked' : ''}`} htmlFor={product.id}> 
							<div id={"card_" + index} className="card">
								<div className="card-body text-center">
									<Image
											src={`${FORMATTER.api_base_url()}${product.image_url}`}
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
					BATAL {/* cancel */}
				</Button>
				<Button type="button" className="btn btn-lg btn-info text-uppercase custom-t2 m-2" onClick={handleSubmitBtn}>
					KIRIM {/* submit */}
				</Button>
		</div>
	</Container>;
}

export default Product;