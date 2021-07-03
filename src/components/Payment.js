/** @format */

import React, { useState } from 'react';


const Payment = ({ paymentProps, API_URL, setTransaction }) => {
	const [method, setMethod] = useState('Cash');
	const [Id, setId] = useState('');

	const updateBattery = async () => {
		let url = `${API_URL}/items/${paymentProps.vehicle.scooterId}/take/${paymentProps.soc}/${paymentProps.station}`;
		fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('update'));
	};

	const addTransaction = () => {
		let transactionId = 'Cash';
		if (method === 'online') {
			transactionId = Id;
		}

		const swap = {
			scooterId: paymentProps.vehicle.scooterId,
			name: paymentProps.vehicle.currentUserName,
			number: paymentProps.vehicle.currentUserNumber,
			batteryId: paymentProps.battery.batteryId,
			amount: paymentProps.cost,
			mode: transactionId,
			station: paymentProps.station,
			stationPrev: paymentProps.battery.station,
		};

		fetch(`${API_URL}/swaps`, {
			method: 'POST',
			body: JSON.stringify(swap),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Battery Provided'));
	};

	const pay = async () => {
		updateBattery();
		addTransaction();
	};
	

	return (
		<>
			<div className='container d-flex justify-content-center mt-5'>
				<div className='card'>
					<div>
						<div className='d-flex pt-3 pl-3'>
							<div>
								<img
									src='https://pbs.twimg.com/profile_images/1349701223029456902/VzzfnhLx_400x400.jpg'
									alt=''
									width='60'
									height='80'
								/>
							</div>
							<div className='mt-3 pl-2'>
								<span className='name'>Hello {paymentProps.vehicle.currentUserName}</span>
								<div>
									<span className='cross'>Battery No. {paymentProps.battery.batteryId}</span>
									<br />
									<span className='cross'>Scooter No. {paymentProps.battery.scooterId}</span>
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
										<span className='amount'>{paymentProps.cost}</span>
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
								<span className='back' type='button' onClick={() => setTransaction(false)}>
									Cancel
								</span>
							</div>{' '}
							<button type='button' className='btn btn-primary button' onClick={() => pay()}>
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
