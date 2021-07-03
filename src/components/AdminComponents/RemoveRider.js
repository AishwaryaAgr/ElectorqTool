import React, {useState} from 'react'

const RemoveRider = ({API_URL}) => {
    const [number, setNumber] = useState(0);

    const deleteit = () => {
        fetch(`${API_URL}/riders`, {
			method: 'DELETE',
			body: JSON.stringify({number}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {alert('Rider Deleted');})
        .catch(e=> alert("Unidentified Number"));
    }

    const removeRider = () => {
        if(number.length !== 10 || Number(number[0])<6)
            return alert("Invalid Contact Number");
        fetch(`${API_URL}/riders/one/${number}`)
        .then(item=> item.json())
        .then(item => {
            
            if(item === null)
                return alert("Unassigned Contact Number");
            if(item.scooterId !== "Not Assigned" || item.batteryId !=="Not Assigned")
                return alert("Unassign Battery/Vehicle First");
            return deleteit();
        }) 
    }
    const confirm = (cb) => {
    const confirmBox = window.confirm( "Do you want to continue" )
    if (confirmBox === true) {
      cb();
    }
  }
    

    return (
        <div className='container mt-5'
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f5f5f5',
					borderRadius: '10px',
				}}>
            <form type="submit">
               <div className='col-12'>
                    <div className='col-12 input-group'>
                        <div className='input-group-text'>+91</div>
                        <input className='form-control' id='number' placeholder='Contact Number' value={number} onChange={(e)=>setNumber(e.target.value)}/>
                    </div>
                </div>
                <button type='button' className='btn btn-primary' onClick={() => confirm(removeRider)}>
                    Remove
                </button>
            </form>
        </div>
    )
}

export default RemoveRider
