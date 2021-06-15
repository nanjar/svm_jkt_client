import { useState } from "react";

const Product = (props) => {
    const {products, handleCancelBtn, selectedProduct, handleOnRadioChange = () => {}, handleSubmitBtn = () => {}} = props;
    const [confirmBtn, setConfirmBtn] = useState(false);
    function handleConfirmBtn(){
        setConfirmBtn(true);
    }
    return <div className="row">
        
        <div className="vw-100 vh-100 d-flex">
            <div className="container-fluid">
                <div className="m-3">

                    <div className="row col-12 justify-content-center">
                        <h1 className="text-center text-uppercase display-4">Choose the product to map</h1>
                    </div>

                    <div className="row mt-5">
                        <div className="row col-12 d-flex justify-content-center">
                            {
                                products.map((product, index) => (
                                    <div key={index} className="col-md-6 col-lg-3 radio-product">
                                        <input type="radio" id={product.id} data-name={product.name} data-url={`http://vending.smartvending.com${product.image_url}`} name="radioProduct" onChange={handleOnRadioChange}/>
                                        <label id={"lbl-" + product.id} className={`radio-img mb-4 ${selectedProduct === product.id ? 'card-checked' : ''}`} htmlFor={product.id}> 
                                            <div id={"card_" + index} className="card">
                                                <img
                                                    src={`http://vending.smartvending.com${product.image_url}`}
                                                    className="card-img-top btn-thumbnail"
                                                    alt={product.name}
                                                />
                                                <div className="card-body text-center">
                                                    <h1 className="card-title">{product.name}</h1>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="text-center mb-5">
                        <button type="button" className="btn btn-lg btn-warning text-uppercase font-weight-bold" onClick={handleCancelBtn}>
                            <h2 className="text-center text-uppercase custom-t2">Cancel</h2>
                        </button>
                        &nbsp;&nbsp;
                        <button type="button" className="btn btn-lg btn-success text-uppercase font-weight-bold" onClick={handleSubmitBtn}>
                            <h2 className="text-center text-uppercase custom-t2">Submit</h2>
                        </button>
                    </div>

                </div>
            </div>
        </div>
        <div></div>
    </div>;
}

export default Product;