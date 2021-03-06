/** @format */

import React, { useState, useEffect } from 'react';

const ReplaceStuff = ({ API_URL }) => {
	let absent = {
		name: 'Not assigned',
		number: '',
		batteryId: 'Not Assigned',
		scooterId: 'Not Assigned',
	};
	const [allBatteries, setAllBatteries] = useState([]);
	const [allVehicles, setAllVehicles] = useState([]);
	const [number, setNumber] = useState();
	const [rider, setRider] = useState(absent);
	const [vehicleId, setVehicleId] = useState('');
	const [batteryId, setBatteryId] = useState('');
	const [soc, setSoc] = useState('');
	const [oldSoc, setOldSoc] = useState('');
	const [station, setStation] = useState('Saket');
	const [time, setTime] = useState('');
	const [date, setDate] = useState('');
	const [desc, setDesc] = useState('');
	const [battery, setBattery] = useState(absent);
	const [reset, setReset] = useState(true);
	const [maintenance, setMaintenance] = useState('1');

	useEffect(() => {
		fetch(`${API_URL}/items`)
			.then((item) => item.json())
			.then((items) => setAllBatteries(items));
		console.log('object');

		fetch(`${API_URL}/vehicles`)
			.then((item) => item.json())
			.then((items) => setAllVehicles(items));
		console.log('object');

	}, [API_URL, reset]);

	const checkSoc = (charge) => {
		if (Number(charge) < 0 || Number(charge) > 50) return false;
		return true;
	};

	const getBattery = (number) => {
		fetch(`${API_URL}/items/${number}`)
			.then((item) => item.json())
			.then((item) => {
				if (item === null) return console.log('No battery');
				setBattery(item);
			});
	};

	const getRider = () => {
		fetch(`${API_URL}/riders/one/${number}`)
			.then((item) => item.json())
			.then((item) => {
				if (item === null) {
					setRider(absent);
					return alert('Check Number');
				} else {
					console.log(item);
					if (item.batteryId !== 'Not Assigned') getBattery(item.number);
					setReset(false);
					return setRider(item);
				}
			});
	};
		const report = (productType, componentId, finalTime) => {
		console.log(finalTime);
		fetch(`${API_URL}/complaints`, {
			method: 'POST',
			body: JSON.stringify({
				productType,
				id: componentId,
				complaintType: 'Unexpected Failure',
				desc: {desc},
				date: finalTime,
				number: rider.number,
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => setReset(true));
	};

	const changeInBattery = () => {
		let stationnew = battery.station;
		if (station !== '') stationnew = station;
		fetch(`${API_URL}/items/give`, {
			method: 'PUT',
			body: JSON.stringify({
				id: batteryId,
				station: stationnew,
				charge: soc,
				user: number,
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Battery'));

		let status = "Not Assigned"
		if(maintenance === '1')
			status = "Under Maintenance"
			
		fetch(`${API_URL}/items/replace`, {
			method: 'PUT',
			body: JSON.stringify({ id: battery.batteryId, soc: oldSoc, status: status }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Battery'));
	};

	const changeInVehicle = () => {
		let num = 0, status = "Not Assigned"
		if(maintenance === '1'){
			num = rider.number;
			status = "Under Maintenance"
		}
		fetch(`${API_URL}/vehicles/unallot/${rider.scooterId}/${num}`, {
			method: 'PUT',
			body: JSON.stringify({ status: status }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Vehicle'));

		fetch(`${API_URL}/vehicles/allot/${vehicleId}`, {
			method: 'PUT',
			body: JSON.stringify({ name: rider.name, number }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Vehicle'));
	};

	const changeBatteryInRider = () => {
		const cost = rider.pendingSwapPayment + battery.batteryCharge - oldSoc;
		fetch(`${API_URL}/riders/replacebattery`, {
			method: 'PUT',
			body: JSON.stringify({ number, batteryId, cost }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Rider Battery'));
	};
	const changeVehicleInRider = () => {
		fetch(`${API_URL}/riders/replacevehicle`, {
			method: 'PUT',
			body: JSON.stringify({ number, scooterId: vehicleId }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Rider Vehicle'));
	};

	const replaceVehicle = (nTime) => {
		fetch(`${API_URL}/vehicles/${vehicleId}`)
			.then((item) => item.json())
			.then((item) => {
				console.log(item);
				if (item === null) return alert('Check Vehicle Id');
				if (item.currentUserName !== 'Not Assigned') return alert('Vehicle Not Vacant');
				if (item.status === 'Under Maintenace') return alert('Vehicle Under Maintenance');
				changeInVehicle();
				changeVehicleInRider();
				if(maintenance === '1')
					report('scooter', rider.scooterId, nTime);
				return alert('Vehicle Replacement Successful');
			});
	};
	const replaceBattery = (nTime) => {
		fetch(`${API_URL}/items/bat/${batteryId}`)
			.then((item) => item.json())
			.then((item) => {
				if (item === null) return alert('Check Battery Id');
				if (item.currentUserNumber !== 0) return alert('Battery Not Vacant');
				if (item.status === 'Under Maintenace') return alert('Battery Under Maintenance');
				changeInBattery();
				changeBatteryInRider();
				if(maintenance === '1')
					report('battery', rider.batteryId, nTime);
				return alert('Battery Replacement Successful');
			});
	};

	const replace = () => {
		let nDate = new Date(date);
		console.log(nDate.getMonth());
		let m = nDate.getMonth(),
			y = nDate.getFullYear(),
			d = nDate.getDate();
		let hour = '',
			min = '';
		for (let i in time) {
			if (i < 2) hour += time[i];
			if (i > 2) min += time[i];
		}
		let nTime = new Date(y, m, d, hour, min);
		if(date === '' || time === '')
			return alert("Set Issue Date and Time");
			
		if (vehicleId !== '' && vehicleId !== '-1' && rider.scooterId !== 'Not Assigned' && rider.scooterId !== '-1') {
			replaceVehicle(nTime);
			
		}
		else{
			alert("Vehicle not replaced")
		}
		if (
			!(batteryId === '' || soc === '' || battery === absent) &&
			batteryId !== '-1' &&
			oldSoc !== '' &&
			rider.batteryId !== 'Not Assigned' &&
			rider.battteryId !== "-1"
		) {
			if (!checkSoc(soc) || !checkSoc(oldSoc)) return alert('Charge Must be between 0 and 50');
			if(Number(oldSoc)> Number(battery.batteryCharge)) return alert("Old Battery Charge in valid!") 

			replaceBattery(nTime);
		}
		else{
			alert("Battery not replaced")
		}
	};
	const confirm = (cb) => {
		const confirmBox = window.confirm('Do you want to continue');
		if (confirmBox === true) cb();
	};

	return (
		<>
			<div
				className='container '
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f5f5f5',
					borderRadius: '10px',
				}}>
				<form className='row row-cols-lg-auto g-3 align-items-center' type='submit'>
					<div className='col-12'>
						<div className='col-12 input-group'>
							<div className='input-group-text'>+91</div>
							<input
								className='form-control'
								id='number'
								placeholder='Contact Number'
								onChange={(e) => setNumber(e.target.value)}
							/>
						</div>
						<button type='button' className='btn btn-primary' onClick={() => getRider()}>
							Get Rider Info
						</button>
						<div className='col-12'>
							Rider Name : <span>{rider.name}</span> <br />
							Scooter Id: <span>{rider.scooterId}</span> <br />
							Battery Id: <span>{rider.batteryId}</span> <br />
						</div>
					</div>
					<div className='col-12' id='vehicle'>
						<select className='form-select' id='bId' onChange={(e) => setVehicleId(e.target.value)}>
							<option defaultValue value='-1'>
								Scooter Number
							</option>
							{allVehicles.map((battery, index) => {
								if (battery.status === 'Not Assigned')
									return (
										<option value={battery.scooterId} key={index}>
											{' '}
											{battery.scooterId}
										</option>
									);
								return <option key={index} style={{ display: 'none' }}></option>;
							})}
						</select>
					</div>
					<div className='col-12' id='vehicle'>
						<select className='form-select' id='bId' onChange={(e) => setBatteryId(e.target.value)}>
							<option defaultValue value='-1'>
								Battery Number
							</option>
							{allBatteries.map((battery, index) => {
								if (battery.status === 'Not Assigned')
									return (
										<option value={battery.batteryId} key={index}>
											{' '}
											{battery.batteryId}
										</option>
									);
								return <option key={index} style={{ display: 'none' }}></option>;
							})}
						</select>
						<input
							className='form-control'
							id='number'
							type="number"
							placeholder='New Battery SoC'
							onChange={(e) => setSoc(e.target.value)}
						/>
						<select className='form-select' onChange={e=> setStation(e.target.value)}>
							<option defaultValue value='Saket'>
											Saket
							</option>
							<option value='MalviyaNagar'>
								MalviyaNagar
							</option>
							<option value='Court'>
								 Court
							</option>
						</select>
					</div>
					<div className='col-12' id='vehicle'>
						<input
							className='form-control'
							id='number'
							placeholder='Old Battery SoC'
							onChange={(e) => setOldSoc(e.target.value)}
						/>
						<input
							type='date'
							className='form-control'
							id='number'
							placeholder='Date when reported'
							onChange={(e) => setDate(e.target.value)}
						/>
						<input
							type='time'
							className='form-control'
							id='number'
							placeholder='Time when reported'
							onChange={(e) => setTime(e.target.value)}
						/>
						<input
							type='textarea'
							className='form-control'
							id='number'
							placeholder='Description'
							onChange={(e) => setDesc(e.target.value)}
						/>
					</div><br />
					<button
						type='button'
						className='btn btn-primary'
						onClick={() => confirm(replace)}
						disabled={reset === true}>
						Confirm Replacement
					</button>
					<input
						type='radio'
						value='1'
						onClick={(e) => setMaintenance(e.target.value)}
						name='optradio'
						className='form-check-input dot'
						defaultChecked
					/>
					<p>Send for maintenance</p>
					<input
						type='radio'
						value='0'
						onClick={(e) => setMaintenance(e.target.value)}
						name='optradio'
						className='form-check-input dot'
					/>
					<p> Don't Send for maintenance</p>
				</form>
			</div>
		</>
	);
};

export default ReplaceStuff;
