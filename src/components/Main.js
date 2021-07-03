/** @format */

import React, { useState } from 'react';
import Give from './Give';
import Payment from './Payment';

const Main = ({API_URL}) => {
	const [transaction, setTransaction] = useState(false);
	const [paymentProps, setPaymentProps] = useState({});

	const giveScooter = () => {
		const bId = document.querySelector('#bId');
		const sId = document.querySelector('#sId');
		const charge = document.querySelector('#charge');
		const station = document.querySelector('#station');

		if (charge.value > 100 || charge.value < 0 || sId.value === 'Scooter Number') {
			return alert('Invalid Entries');
		}
		fetch(`${API_URL}/items/${bId.value}/give/${charge.value}/${sId.value}/${station.value}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {
		// 	document.querySelector('#bId') = ;
		// const sId = document.querySelector('#sId');
		// const charge = document.querySelector('#charge');
		// const station = document.querySelector('#station');
			
			return alert('Battery Provided')});
	};

	const getVehicle = (val, temp3) => {
		const charge = document.querySelector('#charge');
		const station = document.querySelector('#station');

		fetch(`${API_URL}/vehicles/${val}`)
			.then((item) => item.json())
			.then((vehicle) => {
				if (vehicle == null) {
					alert('Scooter Not Alloted');
				} else {
					let temp1 = {
						soc: charge.value,
						station: station.value,
					};
					let temp2 = { ...temp3, vehicle, ...temp1 };
					setPaymentProps(temp2);
					setTransaction(true);
					console.log(temp2);
				}
			});
	};

	const getBattery = async (sId, soc) => {
		fetch(`${API_URL}/items/${sId.value}`)
			.then((item) => item.json())
			.then((battery) => {
				if (battery == null) {
					alert('Check Vehicle Id');
				} else {
					alert(`${(battery.batteryCharge - soc) * 3} rupees`);
					let cost = (battery.batteryCharge - soc) * 3;
					if (cost > 0) {
						let temp = { cost, battery };
						getVehicle(sId.value, temp);
					}
				}
			});
	};

	const takeScooter = async () => {
		const charge = document.querySelector('#charge');
		const sId = document.querySelector('#sId');

		if (charge.value > 100 || charge.value < 0 || sId.value === 'Scooter Number') {
			return alert('Invalid Entries');
		}

		await getBattery(sId, charge.value);

		// updateBattery(sId,charge,station);
	};

	if (!transaction)
		return (
			<>
				<Give giveScooter={giveScooter} takeScooter={takeScooter} />
			</>
		);
	else
		return (
			<>
				<Payment paymentProps={paymentProps} API_URL={API_URL} setTransaction={setTransaction} />
			</>
		);
};

export default Main;
