import React, {useState, useEffect} from 'react'

const Instant = ({API_URL}) => {
    const [allVehicles, setAllVehicles] = useState([])
    const [description, setDescription] = useState("")
    const [scooter, setScooter] = useState({"scooterId": "0"});
    const [done, setDone] = useState(true)

    useEffect(() => {
		// get all vehicles
		fetch(`${API_URL}/vehicles`)
			.then((item) => item.json())
			.then((items) => setAllVehicles(items));
	}, [API_URL, done]);

    const send = val => {
        const ans = allVehicles.filter(veh=> veh.scooterId === val)[0]
        return setScooter(ans);
    }
    const submit = () => {
        if(scooter.scooterId === "0")
            return alert("Select a Scooter");
        if(description === "")
            return alert("Add Comment")
        fetch(`${API_URL}/complaints/`, {
            method: 'POST',
            body: JSON.stringify({
                productType: "Scooter",
                id: scooter.scooterId,
                number: scooter.currentUserNumber,
                complaintType: "Instant Error",
                desc: description,
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then(() => {
            alert("Done");
            setDone(!done);
            setScooter({"scooterId": "0"});
            document.querySelector("#sId").value="0";
            return setDescription("")
        });
    }

    const confirm = (cb) => {
		const confirmBox = window.confirm("Do you want to continue");
		if (confirmBox === true) 
			return cb();
	};

    return (
        <div>
            <div className='container '
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f5f5f5',
					borderRadius: '10px',
				}}>
                <form type="submit">
                    <select
                    className='form-select'
                    id='sId'
                    onChange={(e) => send(e.target.value)}>
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
                <div className='col-12'>
                        <div className='col-12 input-group'>
                            {/* Description Input */}
                            <textarea className='form-control' id='desc' placeholder='Add Comment' value={description} onChange={(e)=>setDescription(e.target.value)}/>
                        </div>
                    </div>
                    <button type='button' className='btn btn-primary' onClick={() => confirm(submit)}>
                        Add Comment
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Instant
