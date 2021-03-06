import React, {useState, useEffect} from 'react'

const Repair = ({API_URL, password}) => {

    
    const [allBatteries, setAllBatteries] = useState([])
    const [allVehicles, setAllVehicles] = useState([])
    const [component, setComponent] = useState("-1")
    const [soc, setSoc] = useState("")
    const [repairedBy, setRepairedBy] = useState("")
    const [station, setStation] = useState("Saket")
    const [consumables, setConsumables] = useState("")
    const [cost, setCost] = useState("")
    const [desc, setDesc] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/items`)
			.then((item) => item.json())
			.then((items) => setAllBatteries(items));
		console.log("object");

        fetch(`${API_URL}/vehicles`)
			.then((item) => item.json())
			.then((items) => setAllVehicles(items));
		console.log("object")
    }, [API_URL, component])

    const checkSoc = charge => {
		if(Number(charge)<0 || Number(charge)>50)
			return false;
		return true;
	}

    const postTransaction = async (rider, vehicle) => {
        const entry = {
			scooterId: vehicle.scooterId, // scooterID
			userName: rider.name, // name of rider
			userNumber: rider.number, // number of rider
			batterySecurity: cost,
			scooterSecurity: 0,
			vehiclePartner: password, // the total kms that is being paid fot
			reason: `Maintenance Cost`, // method of payment
		};
		await fetch(`${API_URL}/inter`, {
			method: 'POST',
			body: JSON.stringify(entry),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Removed'));
    }

    const postSecurity = async (rider, vehicle) => {
        const entry = {
			scooterId: vehicle.scooterId, // scooterID
			userName: rider.name, // name of rider
			userNumber: rider.number, // number of rider
			amount: cost, // the total kms that is being paid fot
			action: 0, // method of payment
            event: `Maintenance Cost of ${desc}`,
            vehiclePartner: vehicle.VP,
            batteryAmount: 0
		};
		await fetch(`${API_URL}/security`, {
			method: 'POST',
			body: JSON.stringify(entry),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => postTransaction(rider,vehicle));
    }

    const report = (type,id)=>{
        fetch(`${API_URL}/complaints/repair`, {
			method: 'POST',
			body: JSON.stringify({
                productType: type,
                id,
                complaintType: "Item Repaired",
                desc: {
                    cost,
                    repairedBy,
                    consumables,
                    desc
                },
            }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert(type + " repaired"));
        setComponent("-1");
    }

    const manageSecurity = async (rider,vehicle)=> {
        fetch(`${API_URL}/riders/changesecurity`, {
            method: 'PUT',
            body: JSON.stringify({
                number: rider.number,
                batterySecurity: rider.batterySecurity,
                scooterSecurity: Number(rider.scooterSecurity - Number(cost)),
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then(() => {
            return postSecurity(rider,vehicle)});
    }
    const repairVehicle = (id, vehicle) => {
        fetch(`${API_URL}/vehicles/unallot/${id}/0`, {
			method: 'PUT',
			body: JSON.stringify({status: "Not Assigned"}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Vehicle'));
        report("vehicle",id);
        if(vehicle.currentUserNumber !== 0)
            fetch(`${API_URL}/riders/one/${vehicle.currentUserNumber}`)
                .then((rider) => rider.json())
                .then(rider => {
                return manageSecurity(rider,vehicle)});
    }

    const repairBattery = id => {
        if(!checkSoc(soc)) return alert("Charge Must be between 0 and 50");
        fetch(`${API_URL}/items/repair`, {
			method: 'PUT',
			body: JSON.stringify({ id, soc, station }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Battery'));
        report("battery", id);
    }

    const pres = async (val,id,cb) => {
        fetch(`${API_URL}/${val}/${id}`)
            .then(item=> item.json())
            .then(item =>{
                if(item.status === "Under Maintenance")
                    return cb(id, item);
                return alert("Item already repaired")
            })
    }

    const repair = () => {
        let id="";
        for(let i=1;i<component.length;i++)
            id+=component[i];
        if(component[0] === 'b'){
            return pres("items/bat", id, repairBattery);
        };
        return pres("vehicles", id, repairVehicle) 
    }

    const confirm = (cb) => {
    const confirmBox = window.confirm( "Do you want to continue" )
    if (confirmBox === true) 
      cb();
    }

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
                <form className='row row-cols-lg-auto g-3 align-items-center' type="submit">
                        
                    <div className="col-12" id="vehicle">
                        <select className='form-select' id='bId' onChange={e=> setComponent(e.target.value)}>
                            <option defaultValue value='-1'>
                                Component
                            </option>
                            {allVehicles.map((battery, index) => {
                                if (battery.status === 'Under Maintenance')
                                    return (
                                        <option value={"s"+battery.scooterId} key={index}>
                                            Scooter No.
                                            {battery.scooterId}
                                        </option>
                                    );
                                return <option key={index} style={{ display: 'none' }}></option>;
                            })}
                            {allBatteries.map((battery, index) => {
                                if (battery.status === 'Under Maintenance')
                                    return (
                                        <option value={"b"+battery.batteryId} key={index}>
                                            Battery No.
                                            {battery.batteryId}
                                        </option>
                                    );
                                return <option key={index} style={{ display: 'none' }}></option>;
                            })}
                        </select>
                    </div>

                    {(() => {
					if (component[0] === 'b') {
                        return(
                            <div className="col-12" id="battery">
                                <input className='form-control' id='number' placeholder='New Battery SoC' type="number" onChange={(e)=>setSoc(e.target.value)}/>
                                <select className='form-select' onChange={e=> setStation(e.target.value)}>
                                    <option defaultValue value=''>
											
										</option>
										<option value='MalviyaNagar'>
											MalviyaNagar
										</option>
                                </select>
                            </div>
                        )
					}
				})()}
                    
                    <div className="col-12" id="vehicle">
                        <input className='form-control' id='number' placeholder='Repaired By' onChange={(e)=>setRepairedBy(e.target.value)}/>
                        <input type="text" className='form-control' id='number' placeholder='Consumables Required' onChange={(e)=>setConsumables(e.target.value)}/>
                        <input type="text" className='form-control' id='number' placeholder='Cost of repair' onChange={(e)=>setCost(e.target.value)}/>
                        <input type="text" className='form-control' id='number' placeholder='Description' onChange={(e)=>setDesc(e.target.value)}/>
                    </div>
                    <button type='button' className='btn btn-primary' disabled= {component === "-1"} onClick={()=>confirm(repair)}>
                        Confirm 
                    </button>
                </form>
            </div>
        </>
    )
}

export default Repair
