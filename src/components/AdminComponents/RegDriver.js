/** @format */

import React, {useState, useEffect} from 'react';

const RegDriver = ({ API_URL , password}) => {

	const [allRiders, setAllRiders] = useState([])
	const [allVehicles, setAllVehicles] = useState([])

	let absent = {
		name: "Not assigned",
		number: "",
		scooterId: "Not Assigned"
	}
	const [rider, setRider] = useState(absent)
	const [vehSec, setVehSec] = useState(0)
	const [batSec, setBatSec] = useState(0);

	const [entryRider, setentryRider] = useState(absent)
	const [entryFlag, setentryFlag] = useState(true)
	const [entrynum, setentryNum] = useState()
	const [entrybatId, setentrybatId] = useState("-1")
	const [entryvehSecurity, setentryvehSecurity] = useState("")
	const [entrybatSecurity, setentrybatSecurity] = useState("")
	const [entrysoc, setentrysoc] = useState("")
	const [entrystation, setentrystation] = useState("Saket")
	const [entryBaazPercent, setEntryBaazPercent] = useState(0)
	const [rent, setRent] = useState(0)
	const [refund, setRefund] = useState(0);
	const [reason, setReason] = useState("");
	const [vrp, setVrp] = useState(0);
	const [vrpList, setVrpList] = useState([]);

	useEffect(() => {
		fetch(`${API_URL}/items`)
			.then((item) => item.json())
			.then((items) => {
				if(items.length === 0)
					return console.log("empty");
				items.sort((a,b)=> a.batteryId - b.batteryId);
				setAllRiders(items)
			});
		console.log("object")

		if(password === "1"){
			setVrpList(["VRP Sanjeev"]);
		}
		else{
			setVrpList(["VRP Sanjeev", "VRP Chirag"]);
		}

		fetch(`${API_URL}/vehicles`)
			.then((item) => item.json())
			.then((items) => {
				if(items.length === 0)
					return console.log("empty");
				items.sort((a,b)=> a.scooterId - b.scooterId);
				if(password === '0')
					return setAllVehicles(items);
				const VpVehicles = items.filter(item => item.VP === Number(password))
				setAllVehicles(VpVehicles)
			});
	}, [API_URL, rider, password]);
	
	const checkSoc = charge => {
		if(Number(charge)<0 || Number(charge)>50)
			return false;
		return true;
	}
	const removeRider = async () => {
		fetch(`${API_URL}/riders/remove`, {
			method: 'PUT',
			body: JSON.stringify({
				number: rider.number,
				batSec: Number(rider.batterySecurity) - Number(batSec),
				scooterSec: Number(rider.scooterSecurity) - Number(vehSec),
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Rider Removed'));
	}

	const removeBattery = () => {
		fetch(`${API_URL}/items/${rider.batteryId}/remove`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Removed Battery'));
	}
	const removeVehicle = async (scooterId) => {
		fetch(`${API_URL}/vehicles/unallot/${scooterId}/0`, {
			method: 'PUT',
			body: JSON.stringify({status: "Not Assigned"}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Rider Removed'));

	}

	const postAdd = async (scooter) => {
		const entry = {
			scooterId: scooter, // scooterID
			userName: entryRider.name, // name of rider
			userNumber: entryRider.number, // number of rider
			batterySecurity: 650,
			scooterSecurity: 1350,
			vehiclePartner: password, // the total kms that is being paid fot
			reason: "New Rider Addition", // method of payment
		};
		await fetch(`${API_URL}/inter`, {
			method: 'POST',
			body: JSON.stringify(entry),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Added'));
	}

	const postRemove = async () => {
		const entry = {
			scooterId: rider.scooterId, // scooterID
			userName: rider.name, // name of rider
			userNumber: rider.number, // number of rider
			batterySecurity: rider.batterySecurity,
			scooterSecurity: Number(rider.scooterSecurity) - rent ,
			vehiclePartner: password, // the total kms that is being paid fot
			reason, // method of payment
		};
		await fetch(`${API_URL}/inter`, {
			method: 'POST',
			body: JSON.stringify(entry),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Removed'));
	}

	const postSecurity1 = async (scooter) => {
        const entry = {
			scooterId: scooter, // scooterID
			userName: entryRider.name, // name of rider
			userNumber: entryRider.number, // number of rider
			amount: 1350, // the total kms that is being paid fot
			action: 1, // method of payment
            event: "New Rider Registration",
            vehiclePartner: password,
            batteryAmount: 650
		};
		await fetch(`${API_URL}/security`, {
			method: 'POST',
			body: JSON.stringify(entry),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {
            return console.log('Security Recharged');
        });
    }

	const postSecurity2 = async () => {
		let amountTemp = Math.min(rent,Number(rider.scooterSecurity));
		let batteryAmountTemp = Math.max(0,rent-Number(rider.scooterSecurity));

        const entry = {
			scooterId: rider.scooterId, // scooterID
			userName: rider.name, // name of rider
			userNumber: rider.number, // number of rider
			amount: Number(amountTemp), // the total kms that is being paid fot
			action: 0, // method of payment
            event: "Rider Removal Penality",
            vehiclePartner: password,
            batteryAmount: Number(batteryAmountTemp)
		};
		await fetch(`${API_URL}/security`, {
			method: 'POST',
			body: JSON.stringify(entry),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {
            return console.log('Security Recharged');
        });
    }

	const assignVehicle = async (name, number,scooterId) => {
		fetch(`${API_URL}/vehicles/allot/${scooterId}`, {
			method: 'PUT',
			body: JSON.stringify({ name, number}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Rider Assigned'));

	}

	const addRider = async (scooterId) => {
		let stayAmount = (Number(entryBaazPercent)*Number(entryvehSecurity))/100;
		let VP = 0;
		if(Number(vrp) === 0){
			VP=1
		}
		fetch(`${API_URL}/riders/add`, {
			method: 'PUT',
			body: JSON.stringify({
				scooterId,
				number: entryRider.number,
				batteryId: entrybatId,
				batterySecurity: Number(entrybatSecurity)+ Number(stayAmount),
				scooterSecurity: Number(entryvehSecurity) - Number(stayAmount),
				vrp: VP
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Rider Assigned'));
	}
	const addBattery = async () => {
		fetch(`${API_URL}/items/give`, {
			method: 'PUT',
			body: JSON.stringify({
				id: entrybatId,
				user: entryRider.number,
				station: entrystation,
				charge: entrysoc
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Rider Assigned'));
	}
	const register = async () => {
		const scooter = document.querySelector('#sId').value;

		if (scooter === '0' || entrybatId === "-1" || entryvehSecurity === "" || entrybatSecurity === "" || entrysoc === "") {
			return alert('Fill all the fields');
		}
		if(entryRider.scooterId !== "Not Assigned" ||  entryRider.batteryId !== "Not Assigned")
			return alert("Rider already has a battery/scooter")
		if(!checkSoc(entrysoc)) return alert("Charge Must be between 0 and 50")
		if(entryBaazPercent > 100) return alert("Check Baaz Percent")
		await assignVehicle(entryRider.name, entryRider.number,scooter);
		addRider(scooter);
		addBattery();
		postSecurity1(scooter);
		postAdd(scooter);
		document.querySelector('#sId').value = "0";
		setRider(absent);
		setentryRider(absent);
		setentryFlag(true);
		setEntryBaazPercent(0);
		
	};

	const addRent = async () => {
		// Object Schema for rent
		const rentJSON = {
			scooterId: rider.scooterId, // scooterID
			name: rider.name, // name of rider
			number: rider.number, // number of rider
			amount: rent, // the total kms that is being paid fot
			mode: "Security Deduction",
			VP: password // method of payment
		};
		await fetch(`${API_URL}/rents`, {
			method: 'POST',
			body: JSON.stringify(rentJSON),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Rent Paid'));
	};

	const currentMinus = borde => {
		const border = new Date(borde)
		// console.log(border)
		let mon = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
		
		let dayss = (border.getFullYear() - 2021) * 365 + mon[Number(border.getMonth())] + border.getDate();
		// let minutess = dayss * 60 * 24 + start.getHours() * 60 + start.getMinutes();
		return dayss;
	}
	
	const nextMinus = borde => {
		const border = new Date(borde)
		let mon = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
		let nextDate = (border.getFullYear() - 2021 + Math.floor((border.getMonth()+1)/12) ) * 365 + mon[(Number(border.getMonth()+1)%12)];
		return nextDate;
	}

	const calculation = (driver, penality) => {
		let current = new Date();
		let refundAmount =0;
		if(driver.latestRent === null || driver.latestRent <= driver.dateAlloted){
			let border = driver.dateAlloted;
			if(driver.latestRent !== null){
				border = driver.latestRent;
			}
			// console.log(current)
			let rentPending = currentMinus(current)- currentMinus(border) + penality;
			setRent(rentPending*44);
			refundAmount = driver.batterySecurity + driver.scooterSecurity - rentPending*44;
		}
		else{
			let border = driver.latestRent;
			let dayCurrent = currentMinus(current);
			let nextBorder = nextMinus(border);
			let rentPending = penality;
			rentPending += dayCurrent - nextBorder;
			setRent(rentPending*44)
			refundAmount = driver.batterySecurity + driver.scooterSecurity - rentPending*44;
		}
		setRefund(refundAmount);
		if(refundAmount <= driver.scooterSecurity){
			setVehSec(refundAmount);
			setBatSec(0);
		}
		else{
			setVehSec(0);
			setBatSec(driver.batterySecurity - (refundAmount - driver.scooterSecurity));
		}
	}

	const riderName = (id) => {
        fetch(`${API_URL}/riders/scooter/${id}`)
		.then((vehicle)=>vehicle.json())
		.then(vehicle=>{
			if(vehicle === null)
				setRider(absent)
			else{
				calculation(vehicle, 3);
				setRider(vehicle);
			}
			console.log(vehicle);
		});
	}
	const remove = () => {
		removeRider();
		removeVehicle(rider.scooterId);
		removeBattery();
		addRent();
		postRemove();
		postSecurity2();
	}
	const check = () => {
		fetch(`${API_URL}/riders/one/${entrynum}`)
		.then(item=> item.json())
		.then(item => {
			if(item !==null && item.scooterId === 'Not Assigned')
			{
				setentryFlag(false);
				setentryRider(item);
			}
			else{
				setentryRider(absent);
				if(item === null)
					return alert("Incorrect Number")
				else
					return alert(`Rider already has Vehicle no ${item.scooterId}`)
			}
			return console.log(item);
		})
	}

	const confirm = (cb) => {
    const confirmBox = window.confirm( "Do you want to continue" )
    if (confirmBox === true) 
      cb();
    }

	return (
		<>
			<div
				className='container'
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f5f5f5',
					borderRadius: '10px',
				}}>
				<form className='row row-cols-lg-auto g-3 align-items-center' type="submit">
					<div className='col-12'>
						<select className='form-select' id='sId' onChange={(e)=>riderName(e.target.value)}>
							<option defaultValue value='0'>Scooter Number</option>
							{allVehicles.map((veh, index) => {
                                if (veh.status !== 'Under Maintenance')
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
					
					{(() => {
						if (rider.scooterId === 'Not Assigned') {
							return (
							<>
								<div className='col-12'>
									<input className='form-control col-9' id='number' placeholder='Rider Contact Number' onChange={e=> {setentryNum(e.target.value); return setentryFlag(true)}}/>
									<button className="btn-success col-4" type='button' onClick={()=> check()}>Check</button>
								</div>
								<div className='col-12'>
									Rider Name :  <span>{entryRider.name}</span> <br/>
									Rider Contact:  <span>{entryRider.number}</span>
								</div>
								<div className='col-12'>
									<select className='form-select' id='bId' onChange={e=> setentrybatId(e.target.value)}>
										<option defaultValue value='-1'>
											Battery Number
										</option>
										{allRiders.map((battery, index) => {
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
								<div className='col-12' style={{display: 'flex'}}>
									<input className='form-control' type="number" placeholder='Vehicle Security' onChange={e=> setentryvehSecurity(e.target.value)}/>
									<input style={{width: "50%"}} className='form-control' type="number" placeholder='Baaz %' onChange={e=> setEntryBaazPercent(e.target.value)}/>
									<span className='dollar'>%</span>
								</div>
								<div className='col-12'>
									<input className='form-control' type="number" placeholder='Battery Security Amount' onChange={e=> setentrybatSecurity(e.target.value)}/>
								</div>
								<div className='col-12'>
									<input className='form-control' type="number" placeholder='State of Charge' onChange={e=> setentrysoc(e.target.value)}/>
								</div>
								<div className='col-12'>
									<select className='form-select' onChange={e=> setentrystation(e.target.value)}>
										<option defaultValue value='Saket'>
											Saket
										</option>
										<option value='MalviyaNagar'>
											MalviyaNagar
										</option>
										<option defaultValue value='SaketCourt'>
											Saket Court
										</option>
									</select>
								</div>
								<div className='col-12'>
									<select className='form-select' onChange={e=> setVrp(e.target.value)}>
									{vrpList.map((partner, index) => {
												return (
													<option value={index} key={index}>
														{partner}
													</option>
												);
										})}
									</select>
								</div>
								<button type='button' className='btn btn-primary' onClick={() => confirm(register)} disabled= {entryFlag}>
									Register
								</button>
							</>)
						}
						else return (
							<>
								<div className='col-12'>
									Current Rider Name :  <span>{rider.name}</span> <br/>
									Current Rider Contact:  <span>{rider.number}</span> <br/>
								</div>
								<b style={{textAlign: "center"}}>
									Security Amount with VRP:  <span>{rider.scooterSecurity}</span> <br/>
									Security Amount with Baaz:  <span>{rider.batterySecurity}</span> <br/>
									Unpaid Rent Amount:  <span>{rent}</span> <br/>
									Security Refund Amount: <span>{refund}</span> <br/>
								</b>
								<input
									type='radio'
									value='0'
									onClick={(e) => calculation(rider, 3)}
									name='optradio'
									className='form-check-input dot'
									defaultChecked
								/>
								<p>Apply Standard Fee</p>
								<input
									type='radio'
									value='3'
									onClick={(e) => calculation(rider,0)}
									name='optradio'
									className='form-check-input dot'
								/>
								<p> No Standard Fee</p>
								<input
									type='text'
									name='text'
									className='form-control ml-1'
									placeholder='Enter Reason for Removal'
									onChange={(e) => setReason(e.target.value)}
									value={reason}
								/>
								<button type='button' className='btn btn-primary' onClick={() => confirm(remove)}>
									Remove
								</button>
							</>
						)
					})()}
				</form>
			</div>
		</>
	);
};

export default RegDriver;
