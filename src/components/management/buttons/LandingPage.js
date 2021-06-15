
const LandingPage = (props) => {
    return <div className="row">
        <div className="col-md-12">
            PRESS BUTTON TO MAP
        </div>
        <div className="col-md-12">
            <button onClick={props.handleCancelBtn}>CANCEL</button>
        </div>
    </div>;
}

export default LandingPage;