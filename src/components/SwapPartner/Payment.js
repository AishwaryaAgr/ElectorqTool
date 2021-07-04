/** @format */

import React, { useState } from 'react';
import './Payment.css';

const Payment = ({ API_URL, rider, current, setRider, setCurrent, absent, setTask }) => {
	const [method, setMethod] = useState('Cash');
	const [Id, setId] = useState('');
	const [amount, setAmount] = useState((Number(current.batteryCharge) - Number(current.soc))*0.8 + Number(rider.pendingSwapPayment))

	const updateRider = () => {
		fetch(`${API_URL}/riders/removeBattery`, {
			method: 'PUT',
			body: JSON.stringify({ number: rider.number }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('updated rider'));
	};

	const updateBattery = async () => {
		let url = `${API_URL}/items/${current.batteryId}/take/${current.soc}/${current.newstate}`;
		fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
		}).then(() => setRider(absent));
	};

	const addTransaction = () => {
		let transactionId = 'Cash';
		if (method === 'online') {
			transactionId = Id;
		}
		let cost = Number(current.batteryCharge) - Number(current.soc);
		const swap = {
			scooterId: rider.scooterId,
			name: rider.name,
			number: rider.number,
			batteryId: current.batteryId,
			amount: rider.pendingSwapPayment + cost,
			mode: transactionId,
			station: current.newstate,
			stationPrev: current.station,
			socFrom: current.batteryCharge,
			socTo: current.soc
		};

		fetch(`${API_URL}/swaps`, {
			method: 'POST',
			body: JSON.stringify(swap),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Battery Provided'));
		console.log(swap);
	};

	const pay = async () => {
		updateRider();
		updateBattery();
		addTransaction();
	};
	const confirm = (cb) => {
		const confirmBox = window.confirm('Do you want to continue');
		if (confirmBox === true) cb();
	};

	return (
		<>
			<div className='container d-flex justify-content-center mt-5'>
				<div className='card'>
					<div>
						<div className='d-flex pt-3 pl-3'>
							<div>
								<img
									className='img'
									src='https://pbs.twimg.com/profile_images/1349701223029456902/VzzfnhLx_400x400.jpg'
									alt=''
									width='60'
									height='80px'
								/>
							</div>
							<div className='mt-3 pl-2'>
								<span className='name'>Hello {rider.name}</span>
								<div>
									<span className='cross'>Battery No. {rider.batteryId}</span>
									<br />
									<span className='cross'>Scooter No. {rider.scooterId}</span>
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
									<span className='head'>Pay Cash</span>
									<div>
										<span className='dollar'>₹</span>
										<span className='amount'>
											{amount}
										</span>
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
											onChange={(e) => setId(e.target.value)}
											className='form-control ml-1'
											placeholder='Transaction Id'
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='d-flex justify-content-between px-3 pt-4 pb-3'>
							<div>
								<span className='back' type='button' onClick={() => setTask(false)}>
									Cancel
								</span>
							</div>{' '}
							<button type='button' className='btn btn-primary button' onClick={() => confirm(pay)}>
								Confirm
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Payment;
