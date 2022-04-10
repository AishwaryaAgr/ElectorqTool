/** @format */

import React, { useState, useEffect } from "react";

const Give = ({
	API_URL,
	rider,
	current,
	setRider,
	setCurrent,
	absent,
	setTask,
}) => {
	const [action, setAction] = useState(true);
	const [batteries, setBatteries] = useState([]);
	const [allVehicles, setAllVehicles] = useState([])

	useEffect(() => {
		fetch(`${API_URL}/items`)
			.then((item) => item.json())
			.then((items) => {
				if(items.length === 0)
					return console.log("empty");
				items.sort((a,b)=> a.batteryId - b.batteryId);
				setBatteries(items)
			});

		fetch(`${API_URL}/vehicles`)
			.then((item) => item.json())
			.then((items) => {
				if(items.length === 0)
					return console.log("empty");
				items.sort((a,b)=> a.scooterId - b.scooterId);
				return setAllVehicles(items)
			});
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

	const checkSoc = (charge) => {
		if (Number(charge) < 0 || Number(charge) > 50) return false;
		return true;
	};

	const stationData = (bId, newCharge, station) => {
		const give = {
			name: rider.name,
			number: rider.number,
			batteryId: bId,
			station,
			soc: newCharge
		};

		fetch(`${API_URL}/provide`, {
			method: 'POST',
			body: JSON.stringify(give),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Swap Completed'));
	};

	const riderUpdate = async (bId) => {
		fetch(`${API_URL}/riders/swap`, {
			method: "PUT",
			body: JSON.stringify({ id: rider.scooterId, batteryId: bId }),
			headers: { "Content-Type": "application/json" },
		}).then(() => console.log("Rider Assigned"));
	};

	const batteryUpdate = (bId, charge, station) => {
		fetch(`${API_URL}/items/give`, {
			method: "PUT",
			body: JSON.stringify({
				id: bId,
				user: rider.number,
				station,
				charge,
			}),
			headers: { "Content-Type": "application/json" },
		}).then(() => alert("Swap Completed"));
	};

	const giveBattery = async () => {
		if (rider === absent) return alert("Scooter Not Assigned");
		if (rider.batteryId !== "Not Assigned")
			return alert("Accept the current battery first");
		const bId = document.querySelector("#bId").value;
		const charge = document.querySelector("#charge").value;
		const station = document.querySelector("#station").value;
		if (!checkSoc(charge)) return alert("Charge Must be between 0 and 50");
		if (bId === "-1") return alert("Add Battery Id");
		if(station === "default") return alert("Select Swap Station")
		await riderUpdate(bId);
		stationData(bId, charge, station);
		batteryUpdate(bId, charge, station);
		setRider(absent);
		document.querySelector("#sId").value = "0";
		document.querySelector("#bId").value = "-1";
		document.querySelector("#charge").value = "";
		document.querySelector("#station").value = "default";
	};

	const getBattery = () => {
		const charge = document.querySelector("#charge").value;
		if (!checkSoc(charge) || charge === "")
			return alert("Charge Must be between 0 and 50");
		// let defaulter = [ 8920743800, 8862959224, 8340614367, 9811582356, 9650869715, 7042824589, 7542856286, 7290801642, 9718769098, 7292082473, 9716841327 ]
		let defaulter = [ ]
		const station = document.querySelector("#station").value;
		// console.log(rider.number);
		for(let i=0;i<defaulter.length;i++){
			if(rider.number === defaulter[i])
				return alert("Please pay the remaining rent first")
		}
		if(document.querySelector("#station").value === "default") return alert("Select Swap Station")
		fetch(`${API_URL}/items/${rider.number}`)
			.then((item) => item.json())
			.then((item) => {
				if(item === null)
					return alert("Battery Mapping Incorrect inform ElecTorq")
				if (Number(item.batteryCharge) < Number(charge))
					return alert("Battery Charge cannot increase");
				let sett = { ...item, soc: charge, newstate: station };
				setCurrent(sett);
				document.querySelector("#sId").value = "0";
				document.querySelector("#charge").value = "";
				document.querySelector("#station").value = "default";
				return setTask(true);
			});
	};

	const takeBattery = async () => {
		if (rider === absent) return alert("Scooter Not Assigned");
		if (rider.batteryId === "Not Assigned")
			return alert("Battery Not Assigned");
		getBattery();
	};
	const confirm = (cb) => {
		const confirmBox = window.confirm("Do you want to continue");
		if (confirmBox === true) 
			return cb();
	};

	return (
		<>
			<button
				className='btn btn-warning'
				onClick={() => setAction(!action)}>
				<i className='fas fa-exchange-alt'></i>
				{/* <FontAwesomeIcon icon={["fas", "coffee"]} /> */}
			</button>
			<div
				className='container-fluid mt-5'
				style={{
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#f5f5f5",
					borderRadius: "10px",
				}}>
				<form className='row row-cols-lg-auto g-3 align-items-center'>
					<div className='col-12'>
						<label className='visually-hidden' htmlFor='sId'>
							Preference
						</label>
						<select
							className='form-select'
							id='sId'
							onChange={(e) => riderName(e.target.value)}>
							<option defaultValue value='0'>
								Scooter Number
							</option>
							{allVehicles.map((veh, index) => {
                                if (veh.status === 'Assigned')
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
					<div className='col-12'>
						Current Rider Name : <span>{rider.name}</span> <br />
						Current Rider Contact: <span>{rider.number}</span>{" "}
						<br />
						Current Battery Status: <span>{rider.batteryId}</span>
					</div>
					{(() => {
						if (action) {
							return (
								<div className='col-12'>
									<label
										className='visually-hidden'
										htmlFor='bId'>
										Preference
									</label>
									<select className='form-select' id='bId'>
										<option defaultValue value='-1'>
											Battery Number
										</option>
										{batteries.map((battery, index) => {
											if (
												battery.status ===
												"Not Assigned"
											)
												return (
													<option
														value={
															battery.batteryId
														}
														key={index}>
														{" "}
														{battery.batteryId}
													</option>
												);
											return (
												<option
													key={index}
													style={{
														display: "none",
													}}></option>
											);
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
							<input
								type='number'
								className='form-control'
								id='charge'
								placeholder='State of Charge'
							/>
						</div>
					</div>

					<div className='col-12'>
						<select className='form-select' id='station'>
							<option value='default'>
								Select Swap Station
							</option>
							<option value='Saket'>
								Saket
							</option>
							<option value='MalviyaNagar'>MalviyaNagar</option>
							<option value='SaketCourt'>
								Saket Court
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
