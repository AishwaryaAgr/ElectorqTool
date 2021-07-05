import React, {useState, useEffect} from 'react'

const Repair = ({API_URL}) => {

    
    const [allBatteries, setAllBatteries] = useState([])
    const [allVehicles, setAllVehicles] = useState([])
    const [component, setComponent] = useState("-1")
    const [soc, setSoc] = useState("")
    const [repairedBy, setRepairedBy] = useState("")
    const [station, setStation] = useState("Station 1")
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

    const repairVehicle = id => {
        fetch(`${API_URL}/vehicles/unallot/${id}`, {
			method: 'PUT',
			body: JSON.stringify({status: "Not Assigned"}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Vehicle'));
        report("vehicle",id)
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

    const pres = async (val,id) => {
        return fetch(`${API_URL}/${val}/${id}`)
            .then(item=> item.json())
            .then(item =>{
                if(item === null)
                    return true;
                return false;
            })
    }

    const repair = () => {
        let id="";
        for(let i=1;i<component.length;i++)
            id+=component[i];
        if(component[0] === 'b' && pres("items/bat", id)){
            return repairBattery(id);
        };
        if(pres("vehicles", id))
            return repairVehicle(id); 
        return alert("Item already repaired")   
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
                                    <option defaultValue value='Station 1'>
                                        Station 1
                                    </option>
                                    <option value='Station 2'>
                                        Station 2
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
