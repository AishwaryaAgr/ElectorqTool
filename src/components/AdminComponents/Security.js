import React , {useState, useEffect} from 'react'

const Security = ({API_URL, password}) => {

    let absent = {
		name: "Not assigned",
		number: "",
		scooterId: "Not Assigned",
        batterySecurity: "0",
        scooterSecurity: "0"
	}

    const [allRiders, setAllRiders] = useState([])
    const [allVehicles, setAllVehicles] = useState([])
    const [selectedRider, setSelectedRider] = useState(absent)
    const [topup, setTopup] = useState(0)

    let url = API_URL;
    useEffect(() => {
        fetch(`${url}/riders`)
			.then((item) => item.json())
			.then((items) => {
				if(items.length === 0)
					return console.log("empty");
				setAllRiders(items)
                return console.log(items)
			});
            
        fetch(`${url}/vehicles`)
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
    }, [url, password, selectedRider])

    const getRider = value => {
        const selected = allRiders.filter(rider => {
            return rider.scooterId === value
        })
        if(selected.length === 0){
            setSelectedRider(absent);
            return alert("Scooter not assigned")
        }
        return setSelectedRider(selected[0]);
    }

    const postSecurity = async () => {
        const entry = {
			scooterId: selectedRider.scooterId, // scooterID
			userName: selectedRider.name, // name of rider
			userNumber: selectedRider.number, // number of rider
			amount: topup, // the total kms that is being paid fot
			action: 1, // method of payment
            event: "Top Up",
            vehiclePartner: password,
            batteryAmount: 0
		};
		await fetch(`${API_URL}/security`, {
			method: 'POST',
			body: JSON.stringify(entry),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {
            alert('Security Recharged');
            setSelectedRider(absent);
            return setTopup(0);
        });
    }

    const amount = value => {
        if(value==="" || value<0)
            return setTopup(0);
        let ans = Math.min(Number(value), 1350 - Number(selectedRider.scooterSecurity));
        return setTopup(ans);
    }
    const recharge = e => {
        
        if(topup === 0)
            return alert("No change in amount");
        fetch(`${API_URL}/riders/changesecurity`, {
            method: 'PUT',
            body: JSON.stringify({
                number: selectedRider.number,
                batterySecurity: selectedRider.batterySecurity,
                scooterSecurity: Number(selectedRider.scooterSecurity + topup),
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then(() => {
            return postSecurity()});
    }

    return (
        <div className='container '
			style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '10px',
            }}>
            
                <div className='col-12'>
                    <select className='form-select' id='sId' onChange={(e)=>getRider(e.target.value)}>
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
                    <div className='col-12' style={{height: "30%", width: "100%", background: "#ffffcc", textAlign: "center", fontSize: "12px"}}>
                        Current Rider Name :  <span>{selectedRider.name}</span> <br/>
                        Current Rider Contact:  <span>{selectedRider.number}</span> <br/>
                        Current Battery Security:  <span>{selectedRider.batterySecurity}</span> <br/>
                        Current Scooter Security:  <span>{selectedRider.scooterSecurity}</span> <br/>
                    </div>
                    <br />
                    <div >
                        <h5>Top Up Scooter Security: </h5>
                        <label>
                        &nbsp; &nbsp; Enter Amount of recharge: &nbsp;
                            <input className='col-5' id='number' placeholder='Amount in Rupees' onChange={e=> amount(e.target.value)}/>
                        </label>
                    </div>
                    <div style={{width: "100%", textAlign: "center"}}>
                         <br /> <br />  <b>New Vehicle Security Amount: <span>{selectedRider.scooterSecurity + topup}</span> </b> <br />
                        <button className="btn btn-success"  onClick={e=> recharge(e)}>Confirm Recharge</button>
                    </div>
                </div>
            
        </div>
    )
}

export default Security
