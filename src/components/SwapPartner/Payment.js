/** @format */

import React, { useState } from 'react';
import './Payment.css';

const Payment = ({ API_URL, rider, current, setRider, setCurrent, absent, setTask }) => {
	const [method, setMethod] = useState('Cash');
	const [Id, setId] = useState('');
	const [amount, setAmount] = useState(Math.ceil((Number(current.batteryCharge) - Number(current.soc) + Number(rider.pendingSwapPayment))))

	const updateRider = () => {
		fetch(`${API_URL}/riders/removeBattery`, {
			method: 'PUT',
			body: JSON.stringify({ number: rider.number }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => setTask(false))};

	const updateBattery = async () => {
		let url = `${API_URL}/items/${current.batteryId}/take/${current.soc}/${current.newstate}`;
		fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {setRider(absent);  return alert("Battery Taken")});
	};

	const addTransaction = () => {
		let transactionId = method;
		if (method === 'online') {
			if(Id === "") transactionId = method;
			else transactionId = Id;

			setId("");
			setMethod("Cash");
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
		}).then(() => console.log("Transaction Added"));
	};

	const secondphase = dt => {
		if(dt[3]== "1" && dt[6]=="7" && dt[8]=="2"){
			if(dt[9]=="5" || dt[9]=="6" || dt[9]=="7" || dt[9]=="8")
			return true;
		}
		return false;
	}

	const pay = async () => {
		addTransaction();
		updateBattery();
		updateRider();
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
									src='https://th.bing.com/th/id/OIP.rVggrpUvs-YAUExsD7c-EAHaHa?w=182&h=183&c=7&o=5&pid=1.7'
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
											type='number'
											name='text'
											onChange={(e) => setId(e.target.value)}
											className='form-control ml-1'
											placeholder='Transaction Id'
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
										value='Unpaid'
										onClick={(e) => setMethod(e.target.value)}
										name='optradio'
										className='form-check-input mt-1 dot'
									/>{' '}
								</div>
								<div className='border-left pl-2'>
									<div>
										<span className='amount'>
											Unpaid
										</span>
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
