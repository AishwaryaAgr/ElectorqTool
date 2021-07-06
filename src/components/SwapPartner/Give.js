/** @format */

import React, { useState, useEffect } from 'react';

const Give = ({ API_URL, rider, current, setRider, setCurrent, absent, setTask }) => {
	const [action, setAction] = useState(true);
	const [batteries, setBatteries] = useState([]);
	useEffect(() => {
		fetch(`${API_URL}/items`)
			.then((item) => item.json())
			.then((items) => setBatteries(items));
	}, [API_URL, action]);

	const riderName = (id) => {
		fetch(`${API_URL}/riders/scooter/${id}`)
			.then((vehicle) => vehicle.json())
			.then((vehicle) => {
				if (vehicle === null) setRider(absent);
				else setRider(vehicle);
				console.log(vehicle);
			});
	};

	const checkSoc = charge => {
		if(Number(charge)<0 || Number(charge)>50)
			return false;
		return true;
	}

	const riderUpdate = async (bId) => {
		fetch(`${API_URL}/riders/swap`, {
			method: 'PUT',
			body: JSON.stringify({ id: rider.scooterId, batteryId: bId }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Rider Assigned'));
	};

	const batteryUpdate = (bId, charge, station) => {
		fetch(`${API_URL}/items/give`, {
			method: 'PUT',
			body: JSON.stringify({ id: bId, user: rider.number, station, charge }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Battery Updated'));
	};

	const giveBattery = async () => {
		if (rider === absent) return alert('Scooter Not Assigned');
		if (rider.batteryId !== 'Not Assigned') return alert('Accept the current battery first');
		const bId = document.querySelector('#bId').value;
		const charge = document.querySelector('#charge').value;
		const station = document.querySelector('#station').value;
		if(!checkSoc(charge)) return alert("Charge Must be between 0 and 50");
		await riderUpdate(bId);
		batteryUpdate(bId, charge, station);
		setRider(absent);
		document.querySelector('#sId').value = '0';
		document.querySelector('#bId').value = '-1';
		document.querySelector('#charge').value = '';
		document.querySelector('#station').value = 'Saket';
	};

	const getBattery = () => {
		const charge = document.querySelector('#charge').value;
		if(!checkSoc(charge)) return alert("Charge Must be between 0 and 50")
		const station = document.querySelector('#station').value;
		fetch(`${API_URL}/items/${rider.number}`)
			.then((vehicle) => vehicle.json())
			.then((item) => {
				if(Number(item.batteryCharge)<Number(charge))
					return alert("Battery Charge cannot increase")
				let sett = { ...item, soc: charge, newstate: station };
				setCurrent(sett);
				document.querySelector('#sId').value = '0';
				document.querySelector('#charge').value = '';
				document.querySelector('#station').value = 'Station 1';
				return setTask(true);
			});
	};

	const takeBattery = async () => {
		
		if (rider === absent) return alert('Scooter Not Assigned');
		if (rider.batteryId === 'Not Assigned') return alert('Battery Not Assigned');
		getBattery();
	};
	const confirm = (cb) => {
		const confirmBox = window.confirm('Do you want to continue');
		if (confirmBox === true) cb();
	};

	return (
		<>
			<button className='btn btn-warning' onClick={() => setAction(!action)}>
				{(() => {
					if (action === false) {
						return <span>Give Battery</span>;
					} else {
						return <span>Take Battery</span>;
					}
				})()}
			</button>
			<div
				className='container-fluid mt-5'
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f5f5f5',
					borderRadius: '10px',
				}}>
				<form className='row row-cols-lg-auto g-3 align-items-center'>
					<div className='col-12'>
						<label className='visually-hidden' htmlFor='sId'>
							Preference
						</label>
						<select className='form-select' id='sId' onChange={(e) => riderName(e.target.value)}>
							<option defaultValue value='0'>Scooter Number</option>
							<option value='24'>Scooter No. 24</option>
							<option value='25'>Scooter No. 25</option>
							<option value='26'>Scooter No. 26</option>
							<option value='27'>Scooter No. 27</option>
							<option value='28'>Scooter No. 28</option>
							<option value='29'>Scooter No. 29</option>
							<option value='30'>Scooter No. 30</option>
							<option value='31'>Scooter No. 31</option>
							<option value='32'>Scooter No. 32</option>
							<option value='33'>Scooter No. 33</option>
							<option value='34'>Scooter No. 34</option>
							<option value='35'>Scooter No. 35</option>
							<option value='36'>Scooter No. 36</option>
							<option value='37'>Scooter No. 37</option>
							<option value='38'>Scooter No. 38</option>
							<option value='39'>Scooter No. 39</option>
							<option value='40'>Scooter No. 40</option>
							<option value='41'>Scooter No. 41</option>
							<option value='42'>Scooter No. 42</option>
							<option value='43'>Scooter No. 43</option>
							<option value='44'>Scooter No. 44</option>
							<option value='46'>Scooter No. 46</option>
							<option value='47'>Scooter No. 47</option>
							<option value='48'>Scooter No. 48</option>
						</select>
					</div>
					<div className='col-12'>
						Current Rider Name : <span>{rider.name}</span> <br />
						Current Rider Contact: <span>{rider.number}</span> <br />
						Current Battery Status: <span>{rider.batteryId}</span>
					</div>
					{(() => {
						if (action) {
							return (
								<div className='col-12'>
									<label className='visually-hidden' htmlFor='bId'>
										Preference
									</label>
									<select className='form-select' id='bId'>
										<option defaultValue value='-1'>
											Battery Number
										</option>
										{batteries.map((battery, index) => {
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
								</div>
							);
						}
					})()}
					<div className='col-12'>
						<label className='visually-hidden' htmlFor='charge'>
							Charge Percent
						</label>
						<div className='input-group'>
							<div className='input-group-text'>%</div>
							<input type='number' className='form-control' id='charge' placeholder='State of Charge' />
						</div>
					</div>

					<div className='col-12'>
						<select className='form-select' id="station">
							<option defaultValue value='Saket'>
											Saket
										</option>
										<option value='MalviyaNagar'>
											MalviyaNagar
										</option>
						</select>
					</div>
					<div className='col-12'>
						{(() => {
							if (action)
								return (
									<button
										type='button'
										className='btn btn-primary'
										onClick={() => confirm(giveBattery)}>
										Give Battery
									</button>
								);
							else
								return (
									<button
										type='button'
										className='btn btn-primary'
										onClick={() => confirm(takeBattery)}>
										Take Battery
									</button>
								);
						})()}
					</div>
				</form>
			</div>
		</>
	);
};

export default Give;
