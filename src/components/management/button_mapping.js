import React from "react";
import { Link } from 'react-router-dom';
import '../../../App.css';

class ButtonMapping extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			buttons: [],
			products: [],
			mapped_product: null,
			button_uuid: null,
		}
	}

	componentDidMount() {
		const url = "http://vending.smartvending.com/api/buttons.json";

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				this.setState({ 
					buttons: response.data
				});
			})
			.catch(() => this.props.history.push("/"));
	}

	MappedButton = () => {
		
	}

	MainContent = () => {
		const initial = this.state.initial;
		const MainContent = (initial) ? this.MappedButton : this.MappingButton;

		return <MainContent />;
 	}

	render() {
		const MainContent = this.MainContent;
		return (
			<div className="vw-100 vh-100 d-flex align-items-center">
				<div className="container-fluid">
					<MainContent />
				</div>
			</div>
		);
	}
}

export default ButtonMapping;