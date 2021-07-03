import React, {useState} from 'react'

const ReplaceStuff = ({API_URL}) => {

    let absent = {
		name: "Not assigned",
		number: "",
		batteryId: "Not Assigned",
        scooterId: "Not Assigned"
	}

    const [number, setNumber] = useState()
    const [rider, setRider] = useState(absent);
    const [vehicleId, setVehicleId] = useState("")
    const [batteryId, setBatteryId] = useState("")
    const [soc, setSoc] = useState("")
    const [station, setStation] = useState("")
    const [time, setTime] = useState("")
    const [date, setDate] = useState("")
    const [finalDate, setFinalDate] = useState("")
    const [desc, setDesc] = useState("");
    const [battery, setBattery] = useState(absent);
    



    const getBattery = (number) => {
        fetch(`${API_URL}/items/${number}`)
            .then(item=>item.json())
            .then(item=>{
                if(item === null)
                    return console.log("No battery")
                setBattery(item);
            })
    }

    const getRider = () => {
        fetch(`${API_URL}/riders/one/${number}`)
			.then((item) => item.json())
            .then(item=>{
                if(item === null){
                    setRider(absent);
                    return alert("Check Number");
                }
                else{
                    console.log(item);
                    if(item.batteryId !== "Not Assigned")
                        getBattery(item.number)
                    return setRider(item);
                }
            })
    }

    const datefun = () => {
        let nDate = new Date(date);
        console.log(nDate.getMonth());
        let m = nDate.getMonth(), y = nDate.getFullYear(), d = nDate.getDate();
        let hour = "",min ="";
        for(let i in time)
        {  
           if(i<2)
                hour+=time[i];
            if(i>2)
                min+=time[i];
        }
        let nTime = new Date(y,m ,d ,hour,min);
        setFinalDate(nTime);
    }
    const changeInBattery = () => {
        let stationnew = battery.station;
        if(station !== "")
            stationnew = station;
        fetch(`${API_URL}/items/give`, {
			method: 'PUT',
			body: JSON.stringify({
                id: batteryId,
                station: stationnew,
                charge: soc,
                user: number
            }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Battery'));

        fetch(`${API_URL}/items/replace`, {
			method: 'PUT',
			body: JSON.stringify({ id: battery.batteryId }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Battery'));
    }

    const changeInVehicle = () => {
        fetch(`${API_URL}/vehicles/unallot/${rider.scooterId}`, {
			method: 'PUT',
			body: JSON.stringify({status: "Under Maintenance"}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Vehicle'));

        fetch(`${API_URL}/vehicles/allot/${vehicleId}`, {
			method: 'PUT',
			body: JSON.stringify({name: rider.name, number}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Vehicle'));
    }

    const changeBatteryInRider = () => {
        const cost = rider.pendingSwapPayment + battery.batteryCharge - soc;
        fetch(`${API_URL}/riders/replacebattery`, {
			method: 'PUT',
			body: JSON.stringify({number, batteryId, cost }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Rider Battery'));
    }
    const changeVehicleInRider = () =>{
        fetch(`${API_URL}/riders/replacevehicle`, {
			method: 'PUT',
			body: JSON.stringify({number, scooterId: vehicleId}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Rider Vehicle'));
    }

    const replaceVehicle = () => {
        fetch(`${API_URL}/vehicles/${vehicleId}`)
        .then(item=> item.json())
        .then(item => {
            console.log(item);
            if(item === null)
                return alert("Check Vehicle Id");
            if(item.currentUserName !== "Not Assigned")
                return alert("Vehicle Not Vacant");
            if(item.status === "Under Maintenace")
                return alert("Vehicle Under Maintenance");
            changeInVehicle();
            changeVehicleInRider();
            return alert("Vehicle Replacement Successful")
        })
    }
    const replaceBattery = () => {
        fetch(`${API_URL}/items/bat/${batteryId}`)
        .then(item=> item.json())
        .then(item => {
            if(item === null)
                return alert("Check Battery Id");
            if(item.currentUserNumber !== 0)
                return alert("Battery Not Vacant");
            if(item.status === "Under Maintenace")
                return alert("Battery Under Maintenance");
            changeInBattery();
            changeBatteryInRider();
            return alert("Battery Replacement Successful")
        })
    }

    const report = (productType, componentId) => {
        fetch(`${API_URL}/complaints`, {
			method: 'POST',
			body: JSON.stringify({
                productType,
                id:componentId,
                complaintType: "Unexpected Failure",
                desc,
                date: finalDate,
                number: rider.number
            }),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => console.log('Changed in Rider Battery'));
    }

    const replace = () => {
        datefun();
        if(vehicleId !== ""){
            replaceVehicle();
            report("scooter", vehicleId);
        }
        if(!(batteryId === "" || soc === "" || battery === absent)){
            replaceBattery();
            report("battery", batteryId)
        }
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
                        <div className='col-12 input-group'>
                            <div className='input-group-text'>+91</div>
                            <input className='form-control' id='number' placeholder='Contact Number' onChange={(e)=>setNumber(e.target.value)}/>
                        </div>
                        <button type='button' className='btn btn-primary' onClick={() => getRider()}>
                            Get Rider Info 
                        </button>
                        <div className='col-12'>
                            Rider Name :  <span>{rider.name}</span> <br/>
                            Scooter Id:  <span>{rider.scooterId}</span> <br/>
                            Battery Id:  <span>{rider.batteryId}</span> <br/>
                        </div>
                    </div>
                    <div className="col-12" id="vehicle">
                        <input className='form-control' id='number' placeholder='Vehicle Id' onChange={(e)=>setVehicleId(e.target.value)}/>
                    </div>
                    <div className="col-12" id="vehicle">
                        <input className='form-control' id='number' placeholder='Battery Id' onChange={(e)=>setBatteryId(e.target.value)}/>
                        <input className='form-control' id='number' placeholder='Soc' onChange={(e)=>setSoc(e.target.value)}/>
                        <input className='form-control' id='number' placeholder='Station' onChange={(e)=>setStation(e.target.value)}/>
                    </div>
                    <div className="col-12" id="vehicle">
                        <input type="date" className='form-control' id='number' placeholder='Date when reported' onChange={(e)=>setDate(e.target.value)}/>
                        <input type="time" className='form-control' id='number' placeholder='Time when reported' onChange={(e)=>setTime(e.target.value)}/>
                        <input type="textarea" className='form-control' id='number' placeholder='Description' onChange={(e)=>setDesc(e.target.value)}/>
                    </div>
                    <button type='button' className='btn btn-primary' onClick={() => confirm(replace)} disabled= {rider === absent}>
                            Confirm Replacement 
                        </button>
                </form>
            </div>
        </>
    )
}

export default ReplaceStuff
