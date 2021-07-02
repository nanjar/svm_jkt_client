import { useEffect, useState } from "react";
import FORMATTER from '../../helpers/Formatter';
import { Link } from 'react-router-dom';
import '../../App.css';
import { Container, Row, Table } from 'react-bootstrap';

const InfoStock = (props) => {
	const [slotData, setSlotData] = useState([]);
	useEffect(() => {
		const url = `${FORMATTER.api_base_url()}/api/topups/layouts.json`; 
	
		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				const rawSlots = response.data;
				let slotList = [];

				rawSlots.forEach(data => {
					if(!slotList[data.tied]) slotList[data.tied] = []; // for unhandle error at initialization
					slotList[data.tied].push(data);
				});

				// slotList.forEach(data => {
				// 	const len = 10 - data.length;
				// 	let iter = 0;
				// 	while(len > iter){
				// 		slotList[data[0].tied].push({
				// 			slot_id: Date.now().toString(36) + Math.random().toString(36).substring(2),
				// 			max_qty: null,
				// 			tied: null,
				// 			product_id: null,
				// 			image: null,
				// 			product_name: null,
				// 			current_stock: null,
				// 			to_stock: null,
				// 			slot_active: null
				// 		})
				// 		iter++;
				// 	}
				// });

				setSlotData(slotList);
			})
			.catch(error => console.log(error.message));
	}, []);

	console.log(slotData);

	return <Container fluid className="text-uppercase m-3">
		<Row className="justify-content-center">
			<p className="text-center custom-t2">Stock Data</p> {/*  `${FORMATTER.api_base_url()}${productURL}` */}
		</Row>

		<Row className="justify-content-center">
			<Table className="text-uppercase p-3">
				<thead className="custom-t5">
					<tr>
						<th>Slot No</th>
						<th>Product</th>
						<th>Current Stock</th>
						<th>Max Quantity</th>
						<th>To Stock Quantity</th>
					</tr>
				</thead>
				<tbody className="custom-t5">
					{
						slotData.map((rowData, index) => (
							rowData.map(data => (
								<tr key={data.slot_id} className={(data.slot_active) ? "" : "text-muted"}>
									<td>{data.slot_id}</td>
									<td><img src={`${FORMATTER.api_base_url()}${data.image}`} className="info-thumbnail border-0" alt={data.product_name} /></td>
									<td>{data.current_stock}</td>
									<td>{data.max_qty}</td>
									<td>{data.to_stock}</td>
								</tr>
							))
						))
					}
				</tbody>
			</Table>
		</Row>

		<Row className="justify-content-center">
			<div className="text-center col align-self-center">
				<Link to="/management" className="btn btn-lg btn-warning text-center text-uppercase custom-t3">
					Logout {/* cancel */}
				</Link>
			</div>
		</Row>
	</Container>
}

export default InfoStock;