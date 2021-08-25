import { Button, Container, Image, Row, Col } from 'react-bootstrap';
import FORMATTER from '../../../helpers/Formatter';

const Product = (props) => {
	const {products, tappedButton, handleCancelBtn, selectedProduct, handleOnRadioChange = () => {}, handleSubmitBtn = () => {}} = props;
	// const [confirmBtn, setConfirmBtn] = useState(false);
	// function handleConfirmBtn(){
	//     setConfirmBtn(true);
	// }
	return <div>
		<Row className="justify-content-center mt-3 mb-3">
			<Col lg={8}> 
				<h1 className="text-center text-uppercase display-4 mb-4">TOMBOL {tappedButton} - PILIH PRODUK</h1> {/* Button 6 - Choose the product to map */}
			</Col>
			<Col lg={4}> 
				<Button type="button" className="btn btn-lg btn-warning text-uppercase custom-t2 m-2 p-3" onClick={handleCancelBtn}>
					BATAL {/* cancel */}
				</Button>
				<Button type="button" className="btn btn-lg btn-info text-uppercase custom-t2 m-2 p-3" onClick={handleSubmitBtn}>
					KIRIM {/* submit */}
				</Button>
			</Col>
		</Row>
		<div className="scroll-div">
			<Row>
				{
					products.map((product, index) => (
						<Col key={index} lg={3} className="radio-product m-2">
							<input type="radio" id={product.id} data-name={product.name} data-url={`${FORMATTER.api_images()}${product.image_url}`} name="radioProduct" onChange={handleOnRadioChange}/>
							<label id={"lbl-" + product.id} className={`radio-img mb-4 ${selectedProduct === product.id ? 'card-checked' : ''}`} htmlFor={product.id}> 
								<div id={"card_" + index} className="card">
									<div className="card-body text-center">
										<Image
												src={`${FORMATTER.api_images()}${product.image_url}`}
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
		</div>
		{/* <Row className="text-center mt-4">
			<Col lg={{ span: 4, offset: 8 }}> 
				<Button type="button" className="btn btn-lg btn-warning text-uppercase custom-t2 m-2" onClick={handleCancelBtn}>
					BATAL {/* cancel 
				</Button>
				<Button type="button" className="btn btn-lg btn-info text-uppercase custom-t2 m-2" onClick={handleSubmitBtn}>
					KIRIM {/* submit 
				</Button>
			</Col>
		</Row> */}
	</div>;
}

export default Product;