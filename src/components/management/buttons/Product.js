import { Button, Image, Row, Col } from 'react-bootstrap';

const Product = (props) => {
	const {products, handleCancelBtn, selectedProduct, handleOnRadioChange = () => {}, handleSubmitBtn = () => {}} = props;
	// const [confirmBtn, setConfirmBtn] = useState(false);
	// function handleConfirmBtn(){
	//     setConfirmBtn(true);
	// }
	return <Row className="justify-content-center">
		<h1 className="text-center text-uppercase display-4 mb-4">Choose the product to map</h1>
		<Row>
		{
			products.map((product, index) => (
					<Col key={index} className="radio-product m-3">
						<input type="radio" id={product.id} data-name={product.name} data-url={`http://vending.smartvending.com${product.image_url}`} name="radioProduct" onChange={handleOnRadioChange}/>
						<label id={"lbl-" + product.id} className={`radio-img mb-4 ${selectedProduct === product.id ? 'card-checked' : ''}`} htmlFor={product.id}> 
							<div id={"card_" + index} className="card">
								<Image
										src={`http://vending.smartvending.com${product.image_url}`}
										className="card-img-top btn-thumbnail mt-3"
										alt={product.name}
								/>
								<div className="card-body text-center">
										<h1 className="card-title">{product.name}</h1>
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
	</Row>;
}

export default Product;