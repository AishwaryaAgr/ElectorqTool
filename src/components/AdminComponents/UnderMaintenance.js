/** @format */

import React, { useState, useEffect } from 'react';

const UnderMaintenance = ({ API_URL }) => {
	const [allBatteries, setAllBatteries] = useState([])
    const [allVehicles, setAllVehicles] = useState([])
    const [component, setComponent] = useState("-1")
    const [repairedBy, setRepairedBy] = useState("")
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

    const report = (type,id)=>{
        fetch(`${API_URL}/complaints/repair`, {
			method: 'POST',
			body: JSON.stringify({
                productType: type,
                id,
                complaintType: "Sent for Maintenance",
                desc: {
                    repairedBy,
                    desc
                },
            }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => alert(type + " removed from fleet"));
        setComponent("-1");
        document.querySelector("#cId").value = -1;
    }

    const underVehicle = id => {
        fetch(`${API_URL}/vehicles/unallot/${id}`, {
			method: 'PUT',
			body: JSON.stringify({status: "Under Maintenance"}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Vehicle'));
        report("vehicle",id)
    }

    const underBattery = id => {
        
        fetch(`${API_URL}/items/under`, {
			method: 'PUT',
			body: JSON.stringify({ id}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Battery'));
        report("battery", id);
    }

    const pres = async (val,id,cb) => {
        fetch(`${API_URL}/${val}/${id}`)
            .then(item=> item.json())
            .then(item =>{
                if(item.status === "Not Assigned")
                    return cb(id);
                return alert("Check the item id")
            })
    }

    const under = () => {
        let id="";
        for(let i=1;i<component.length;i++)
            id+=component[i];
        if(component[0] === 'b'){
            return pres("items/bat", id, underBattery);
        };
        if(component[0] === 's'){
            return pres("vehicles", id, underVehicle);
        };
        return alert("Select Component");
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
                        
                    <div className="col-12" id="vehicle">
                        <select className='form-select' id='bId' onChange={e=> setComponent(e.target.value)}>
                            <option defaultValue value='-1'>
                                Component
                            </option>
                            {allVehicles.map((battery, index) => {
                                if (battery.status === 'Not Assigned')
                                    return (
                                        <option value={"s"+battery.scooterId} key={index}>
                                            Scooter No.
                                            {battery.scooterId}
                                        </option>
                                    );
                                return <option key={index} style={{ display: 'none' }}></option>;
                            })}
                            {allBatteries.map((battery, index) => {
                                if (battery.status === 'Not Assigned')
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

                    
                    <div className="col-12" id="vehicle">
                        <input className='form-control' id='number' placeholder='Reporting By' onChange={(e)=>setRepairedBy(e.target.value)}/>
                        <input type="text" className='form-control' id='number' placeholder='Description' onChange={(e)=>setDesc(e.target.value)}/>
                    </div>
                    <button type='button' className='btn btn-primary' disabled= {component === "-1"} onClick={()=>confirm(under)}>
                        Confirm 
                    </button>
                </form>
            </div>
        </>
    )
}

export default UnderMaintenance