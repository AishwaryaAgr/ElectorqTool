import React, {useState, useEffect} from 'react'

const Give = ({API_URL, rider, current, setRider, setCurrent, absent, setTask}) => {
    

    const [action, setAction] = useState(true);
	const [batteries, setBatteries] = useState([]);
    useEffect(() => {
		fetch(`${API_URL}/items`)
			.then((item) => item.json())
			.then((items) => setBatteries(items));
	}, [API_URL, action]);

    const riderName = (id) => {
        fetch(`${API_URL}/riders/scooter/${id}`)
		.then((vehicle)=>vehicle.json())
		.then(vehicle=>{
			if(vehicle === null)
				setRider(absent)
			else
				setRider(vehicle);
			console.log(vehicle);
		});
        
	}
    const riderUpdate = async (bId) => {
        fetch(`${API_URL}/riders/swap`, {
			method: 'PUT',
			body: JSON.stringify({id: rider.scooterId, batteryId: bId}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Rider Assigned'));
    }

    const batteryUpdate = (bId, charge, station) => {
        fetch(`${API_URL}/items/give`, {
			method: 'PUT',
			body: JSON.stringify({id: bId, user: rider.number, station, charge}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Battery Updated'));
    }

    const giveBattery = async  () => {
        if(rider === absent)
            return alert("Scooter Not Assigned");
        if(rider.batteryId !=="Not Assigned")
            return alert("Accept the current battery first")
        const bId = document.querySelector('#bId').value
		const charge = document.querySelector('#charge').value
		const station = document.querySelector('#station').value

        await riderUpdate(bId);
        batteryUpdate(bId, charge, station);
        
    }

    const getBattery = ()=>{
        const charge = document.querySelector('#charge').value
		const station = document.querySelector('#station').value
        fetch(`${API_URL}/items/${rider.number}`)
        .then((vehicle)=>vehicle.json())
        .then(item=> {
            let sett = {...item, soc:charge, newstate: station}
            setCurrent(sett);
            console.log(sett);
            return setTask(true);
        });
    }

    const takeBattery = async () => {
        if(rider === absent)
            return alert("Scooter Not Assigned");
        if(rider.batteryId === "Not Assigned")
            return alert("Battery Not Assigned");
        getBattery()

    }
    const confirm = (cb) => {
    const confirmBox = window.confirm( "Do you want to continue" )
    if (confirmBox === true) 
      cb();
    }

    return (
        <>

            <button className='btn btn-warning' onClick={() => setAction(!action)}>
                {(() => {
                    if (action === false) {
                        return <span>Give Battery</span>;
                    } else {
                        return <span>Take Battery</span>;
                    }
                })()}
            </button>
            <div
                className='container-fluid mt-5'
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '10px',
                }}>
                <form className='row row-cols-lg-auto g-3 align-items-center'>
                    
                    <div className='col-12'>
                        <label className='visually-hidden' htmlFor='sId'>
                            Preference
                        </label>
                        <select className='form-select' id='sId' onChange={(e)=>riderName(e.target.value)} >
                            <option defaultValue>Scooter Number</option>
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
                    <div className='col-12'>
						Current Rider Name :  <span>{rider.name}</span> <br/>
						Current Rider Contact:  <span>{rider.number}</span> <br/>
						Current Battery Status:  <span>{rider.batteryId}</span>
					</div>
                    {(() => {
                        if (action) {
                            return (
                                <div className='col-12'>
                                    <label className='visually-hidden' htmlFor='bId'>
                                        Preference
                                    </label>
                                    <select className='form-select' id='bId'>
                                        <option defaultValue>Battery Number</option>
                                        {batteries.map((battery, index) => {
                                            if (battery.status === "Not Assigned")
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
                            );
                        }
                    })()}
                    <div className='col-12'>
                        <label className='visually-hidden' htmlFor='charge'>
                            Charge Percent
                        </label>
                        <div className='input-group'>
                            <div className='input-group-text'>%</div>
                            <input type='text' className='form-control' id='charge' placeholder='State of Charge' />
                        </div>
                    </div>

                    <div className='col-12'>
                        <input className='form-control' id='station' placeholder='Station Name' />
                    </div>
                    <div className='col-12'>
                        {(() => {
                            if (action)
                                return (
                                    <button type='button' className='btn btn-primary' onClick={()=> confirm(giveBattery)}>
                                        Give Battery
                                    </button>
                                );
                            else
                                return (
                                    <button type='button' className='btn btn-primary' onClick={()=> confirm(takeBattery)}>
                                        Take Battery
                                    </button>
                                );
                        })()}
                    </div>
                </form>
            </div>
        </>
    )
}

export default Give
