/** @format */

import React, { useState, useEffect } from 'react';
import '../../App.css';
const TakeRent = ({ API_URL, setTask , password}) => {

	let absent = {
		name: "Not Assigned",
		number: ""
	}

	//State Variables with initailization
	const [method, setMethod] = useState('Cash'); // Default payment method is Cash
	const [Id, setId] = useState('');
	const [first, setFirst] = useState('');
	const [days, setDays] = useState('');
	const [allVehicles, setAllVehicles] = useState([])
	const [rider, setRider] = useState(absent)
	const [amount, setAmount] = useState(0)

	let url = API_URL
	// INITIALIZATION
	useEffect(() => {
		// Fetch all vehicles from the database
		fetch(`${url}/vehicles`)
			.then((item) => item.json())
			.then((items) => {
				if(items.length === 0)
					return console.log("empty");
				items.sort((a,b)=> a.scooterId - b.scooterId);
				if(password === '0')
					return setAllVehicles(items);
				console.log(items)
				const VpVehicles = items.filter(item => item.VP === Number(password))
				setAllVehicles(VpVehicles)
			});
	}, [url, password]);

	// Add Rent entry in DB
	const addRent = async (vehicle, transactionId) => {
		// Object Schema for rent
		const rent = {
			scooterId: vehicle.scooterId, // scooterID
			name: vehicle.currentUserName, // name of rider
			number: vehicle.currentUserNumber, // number of rider
			amount, // the total kms that is being paid fot
			mode: transactionId,
			VP: password // method of payment
		};
		await fetch(`${API_URL}/rents`, {
			method: 'POST',
			body: JSON.stringify(rent),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Rent Paid'));

		fetch(`${API_URL}/riders/rents`, { // Update Last rent date in rider DB
			method: 'PUT',
			body: JSON.stringify({ id: vehicle.scooterId }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {
			// Reset form fields
			setDays('');
			setFirst('');
			setId('');
			setMethod('Cash');
		});
	};

	// Get Vehicle associated to the scooter Id that has been entered
	const getVehicle = async (scooter, transactionId) => {
		fetch(`${API_URL}/vehicles/${scooter}`)
			.then((item) => item.json())
			.then((vehicle) => {
				if (vehicle == null) {
					return alert('Check Scooter Id');
				}
				
				addRent(vehicle, transactionId); // If such a battery exists the process is continued
			});
	};

	// Container function with checks to mark paid rent
	const takeRent = async () => {
		const scooter = document.querySelector('#sId').value;
		let transactionId = 'Cash';
		if (method === 'online') {
			transactionId = Id;
		}
		await getVehicle(scooter, transactionId); 

		document.querySelector('#sId').value = '0';
		document.querySelector('.amount').value = '';
	};

	// Calculating the number of days between two dates
	const totalDays = (start) => {
		let mon = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

		let dayss = (start.getFullYear() - 2021) * 365 + mon[Number(start.getMonth())] + start.getDate();
		// let minutess = dayss * 60 * 24 + start.getHours() * 60 + start.getMinutes();
		return dayss;
	};

	const totalDaysLeft = mid => {
		let mon = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

		let dayss = totalDays(mid);
		let nextDate = (mid.getFullYear() - 2021 + Math.floor((mid.getMonth()+1)/12) ) * 365 + mon[(Number(mid.getMonth()+1)%12)];
		console.log(dayss);
		console.log(nextDate);
		return nextDate - dayss + 1;
	}

	// Fetching rider info associated to the provided scooter
	const riderName = (id) => {
		// console.log(id);
		fetch(`${API_URL}/riders/scooter/${id}`)
			.then((vehicle) => vehicle.json())
			.then((vehicle) => {
				if (vehicle === null || vehicle.scooterId === 'Not Assigned') { // If no such rider exists reset the variables and forms
					setFirst('');
					setDays('');
					setRider(absent);
					setAmount(0)
					return alert('Scooter Not Assigned');
				} else {
					let start = new Date(vehicle.dateAlloted);
					// alert(vehicle.name)
					if (vehicle.latestRent === null || vehicle.latestRent <= vehicle.dateAlloted) {
						if(vehicle.latestRent != null)
							start = vehicle.latestRent
						let eday = Math.min(1300,Number(totalDaysLeft(start)*44));
						setFirst(' {First Transaction}');
						setAmount(eday)
					} else {
						setFirst('');
						setAmount(1300);
					}
					setRider(vehicle);
				}
			});
	};

	// Confirmation Alert
	const confirm = (cb) => {
		const confirmBox = window.confirm('Do you want to continue');
		if (confirmBox === true) cb();
	};

	// Work Flow
	// riderName -> confirm -> takeRent -> getVehicle -> addRent

	return (
		<>
			<div className='container d-flex justify-content-center pt-2'>
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
											{/* Displaying all vehicles in the DB */}
											{allVehicles.map((veh, index) => {
												if (veh.status !== 'Under Maintenance') // Filtering out of service vehicles
													return (
														<option value={veh.scooterId} key={index}>
															Scooter No.
															{veh.scooterId}
														</option>
													);
												return <option key={index} style={{ display: 'none' }}></option>;
											})}
										</select>
									</div>
								</div>
							</div>
						</div>
						{(() => {
							if (rider.name !== "Not Assigned") {
								return (
									<div className='col-12' style={{
										alignItems: "center",
										justifyContent: "center",
										width: "100%",
										display: "flex",
										flexDirection: "column"
									}}>
										<div>
											Rider Name : <span>{rider.name}</span>
										</div>
										<div>
											Rider Contact: <span>{rider.number}</span>{" "}
										</div>
									</div>
								);
							}
						})()}
						{/* <div className='py-2 px-3'>
							<div className='second pl-2 d-flex py-2'>
								<div className='border-left pl-2  mx-3'>
									First here represents where it is the first payment by the selected rider so that addition compensations can be selected
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
						*/}

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
										<span className='dollar'>Amount </span>
										<span className='amount'><span className='dollar'>₹</span>{amount}</span>
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
