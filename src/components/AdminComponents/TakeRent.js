/** @format */

import React, { useState } from 'react';
import '../../App.css';
const TakeRent = ({ API_URL, setTask }) => {
	const [method, setMethod] = useState('Cash');
	const [Id, setId] = useState('');
	const [first, setFirst] = useState('');
	const [days, setDays] = useState('');

	const addRent = async (vehicle, transactionId, amount) => {
		const rent = {
			scooterId: vehicle.scooterId,
			name: vehicle.currentUserName,
			number: vehicle.currentUserNumber,
			amount,
			mode: transactionId,
		};
		await fetch(`${API_URL}/rents`, {
			method: 'POST',
			body: JSON.stringify(rent),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Rent Paid'));

		fetch(`${API_URL}/riders/rents`, {
			method: 'PUT',
			body: JSON.stringify({ id: vehicle.scooterId }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {
			setDays('');
			setFirst('');
			setId('');
			setMethod('Cash');
		});
	};

	const getVehicle = async (scooter, transactionId, amount) => {
		fetch(`${API_URL}/vehicles/${scooter}`)
			.then((item) => item.json())
			.then((vehicle) => {
				if (vehicle == null) {
					return alert('Check Scooter Id');
				}
				addRent(vehicle, transactionId, amount);
			});
	};

	const takeRent = async () => {
		if(days === '')
			return alert("Don't cheat");
		const scooter = document.querySelector('#sId').value;
		const amount = document.querySelector('#amount').value;
		let transactionId = 'Cash';
		if (method === 'online') {
			transactionId = Id;
		}
		await getVehicle(scooter, transactionId, amount);

		document.querySelector('#sId').value = '0';
		document.querySelector('#amount').value = '';
	};

	const totalDays = (start) => {
		let mon = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

		let dayss = (start.getFullYear() - 2021) * 365 + mon[Number(start.getMonth())] + start.getDate();
		let minutess = dayss * 60 * 24 + start.getHours() * 60 + start.getMinutes();
		return dayss;
	};

	const riderName = (id) => {
		// console.log(id);
		fetch(`${API_URL}/riders/scooter/${id}`)
			.then((vehicle) => vehicle.json())
			.then((vehicle) => {
				if (vehicle === null || vehicle.scooterId === 'Not Assigned') {
					setFirst('');
					setDays('');
					return alert('Scooter Not Assigned');
				} else {
					let start = new Date(vehicle.dateAlloted);
					let mid = new Date(vehicle.latestRent);
					let end = new Date();

					let sday = totalDays(start);
					let mday = totalDays(mid);
					let eday = totalDays(end);

					if (sday === mday) {
						setFirst(' {First Transaction}');
					} else {
						setFirst('');
					}
					setDays(eday - mday);
				}
			});
	};

	const confirm = (cb) => {
		const confirmBox = window.confirm('Do you want to continue');
		if (confirmBox === true) cb();
	};

	return (
		<>
			<div className='container d-flex justify-content-center mt-5 pt-2'>
				<div className='card pt-4'>
					<div>
						<div className='py-2 px-3'>
							<div className='second pl-2 d-flex py-2'>
								<div className='border-left pl-2  mx-3'>
									<span className='head'>Scooter Number</span>
									<div className='d-flex'>
										<select
											className='form-select'
											id='sId'
											onChange={(e) => riderName(e.target.value)}>
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
								</div>
							</div>
						</div>
						<div className='py-2 px-3'>
							<div className='second pl-2 d-flex py-2'>
								<div className='border-left pl-2  mx-3'>
									<span className='head'>Amount {first}</span>
									<div className='d-flex'>
										<span className='dollar'>₹</span>
										<input
											type='number'
											name='text'
											className='form-control ml-1'
											placeholder='Enter Amount'
											id='amount'
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='py-2 px-3'>
							<div className='first pl-2 d-flex py-2'>
								<div className='form-check'>
									{' '}
									<input
										type='radio'
										value='cash'
										onClick={(e) => setMethod(e.target.value)}
										name='optradio'
										className='form-check-input mt-3 dot'
										defaultChecked
									/>{' '}
								</div>
								<div className='border-left pl-2'>
									<span className='head'>Take Cash</span>
									<div>
										<span className='dollar'>For </span>
										<span className='amount'>{days} Days</span>
									</div>
								</div>
							</div>
						</div>
						<div className='py-2 px-3'>
							<div className='second pl-2 d-flex py-2'>
								<div className='form-check'>
									{' '}
									<input
										type='radio'
										value='online'
										onClick={(e) => setMethod(e.target.value)}
										name='optradio'
										className='form-check-input mt-3 dot'
									/>{' '}
								</div>
								<div className='border-left pl-2'>
									<span className='head'>Pay Online</span>
									<div className='d-flex'>
										<span className='dollar'>₹</span>
										<input
											type='text'
											name='text'
											className='form-control ml-1'
											placeholder='Transaction Id'
											onChange={(e) => setId(e.target.value)}
											value={Id}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='d-flex justify-content-between px-3 pt-4 pb-3'>
							<div>
								<span className='back' type='button' onClick={() => setTask('Rider')}>
									Cancel
								</span>
							</div>{' '}
							<button type='button' className='btn btn-primary button' onClick={() => confirm(takeRent)}>
								Confirm
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TakeRent;
