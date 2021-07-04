/** @format */

import React, {useState, useEffect} from 'react';

const RegDriver = ({ API_URL }) => {

	const [allRiders, setAllRiders] = useState([])

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
	const [entrybatId, setentrybatId] = useState()
	const [entryvehSecurity, setentryvehSecurity] = useState()
	const [entrybatSecurity, setentrybatSecurity] = useState()
	const [entrysoc, setentrysoc] = useState(1)
	const [entrystation, setentrystation] = useState()

	useEffect(() => {
		fetch(`${API_URL}/items`)
			.then((item) => item.json())
			.then((items) => setAllRiders(items));
		console.log("object")
	}, [API_URL, rider]);
	
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
		fetch(`${API_URL}/vehicles/unallot/${scooterId}`, {
			method: 'PUT',
			body: JSON.stringify({status: "Not Assigned"}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Rider Removed'));

	}

	const assignVehicle = async (name, number,scooterId) => {
		fetch(`${API_URL}/vehicles/allot/${scooterId}`, {
			method: 'PUT',
			body: JSON.stringify({ name, number}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert('Rider Assigned'));

	}

	const addRider = async (scooterId) => {
		fetch(`${API_URL}/riders/add`, {
			method: 'PUT',
			body: JSON.stringify({
				scooterId,
				number: entryRider.number,
				batteryId: entrybatId,
				batterySecurity: entrybatSecurity,
				scooterSecurity: entryvehSecurity
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

		if (scooter === '0') {
			return alert('Pick a scooter');
		}
		if(!checkSoc(entrysoc)) return alert("Charge Must be between 0 and 50")
		await assignVehicle(entryRider.name, entryRider.number,scooter);
		addRider(scooter);
		addBattery();
		document.querySelector('#sId').value = "0";
		setRider(absent);
		setentryRider(absent);
		entryFlag(true);
		
	};

	const riderName = (id) => {
        fetch(`${API_URL}/riders/scooter/${id}`)
		.then((vehicle)=>vehicle.json())
		.then(vehicle=>{
			if(vehicle === null)
				setRider(absent)
			else
				setRider(vehicle);
			console.log(rider);
		});
	}
	const remove = () => {
		removeRider();
		removeVehicle(rider.scooterId);
		removeBattery();
	}
	const check = () => {
		fetch(`${API_URL}/riders/one/${entrynum}`)
		.then(item=> item.json())
		.then(item => {
			if(item !==null)
			{
				setentryFlag(false);
				setentryRider(item);
			}
			else{
				setentryRider(absent);
				alert("Incorrect Number")
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
				className='container mt-5'
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
							<option value='1'>One</option>
							<option value='2'>Two</option>
							<option value='3'>Three</option>
							<option value='4'>Four</option>
							<option value='5'>Five</option>
							<option value='6'>Six</option>
							<option value='7'>Seven</option>
							<option value='8'>Eight</option>
							<option value='9'>Nine</option>
							<option value='10'>Ten</option>
							<option value='11'>Eleven</option>
							<option value='12'>Twelve</option>
							<option value='13'>Thirteen</option>
							<option value='14'>Forteen</option>
							<option value='15'>Fifteen</option>
							<option value='16'>Sixteen</option>
							<option value='17'>Seventeen</option>
							<option value='18'>Eighteen</option>
							<option value='19'>Nineteen</option>
							<option value='20'>Twenty</option>
							<option value='21'>Twentyone</option>
							<option value='22'>Twentytwo</option>
							<option value='23'>Twentythree</option>
							<option value='24'>Twentyfour</option>
							<option value='25'>Twentyfive</option>
							<option value='26'>Twentysix</option>
						</select>
					</div>
					
					
					{(() => {
						if (rider.scooterId === 'Not Assigned') {
							return (
							<>
								<div className='col-12'>
									<input className='form-control col-9' id='number' placeholder='Rider Contact Number' onChange={e=> {setentryNum(e.target.value); return setentryFlag(true)}}/>
									<button className="btn-success col-2" type='button' onClick={()=> check()}>Check</button>
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
								<div className='col-12'>
									<input className='form-control' placeholder='Vehicle Security Amount' onChange={e=> setentryvehSecurity(e.target.value)}/>
								</div>
								<div className='col-12'>
									<input className='form-control' placeholder='Battery Security Amount' onChange={e=> setentrybatSecurity(e.target.value)}/>
								</div>
								<div className='col-12'>
									<input className='form-control' placeholder='State of Charge' onChange={e=> setentrysoc(e.target.value)}/>
								</div>
								<div className='col-12'>
									<input className='form-control' placeholder='Station Name' onChange={e=> setentrystation(e.target.value)}/>
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
										Current Battery Security:  <span>{rider.batterySecurity}</span> <br/>
										Current scooterSecurity:  <span>{rider.scooterSecurity}</span> <br/>
									</div>
									<div className='col-12'>
										<input className='form-control' id='vehicleSec' placeholder='Vehicle Security Returned' onChange={e=> setVehSec(e.target.value)}/>
									</div>
									<div className='col-12'>
										<input className='form-control' id='batterySec' placeholder='Battery Security Returned' onChange={e=> setBatSec(e.target.value)}/>
									</div>
									<button type='button' className='btn btn-primary' onClick={() => confirm(remove)}>
										Remove
									</button>
								</>)
					})()}
				</form>
			</div>
		</>
	);
};

export default RegDriver;
