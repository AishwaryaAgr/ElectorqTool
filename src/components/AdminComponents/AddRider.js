import React , {useState} from 'react'

const AddRider = ({API_URL}) => {
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")

    const checkNumber= () =>{
        if(number.length !== 10 || Number(number[0])<6)
            return true;
        return false;
    }

    const addRider = () => {
		fetch(`${API_URL}/riders`, {
			method: 'POST',
			body: JSON.stringify({name, number}),
			headers: { 'Content-Type': 'application/json' },
		}).then(() => {alert('Rider Created'); setNumber(""); return setName("");});
	}
    const getRider = () => {
        if(checkNumber())
            return alert("Test Number Entered");

        fetch(`${API_URL}/riders/one/${number}`)
        .then(item=> item.json())
        .then((item) => {
            if(item===null)
                addRider();
            else    
                alert('Number Occupied'); 
            setNumber(""); 
            return setName("");});
    }
    const confirm = (cb) => {
    const confirmBox = window.confirm( "Do you want to continue" )
    if (confirmBox === true) 
      cb();
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
                    <div className='input-group'>
                        <input type='text' className='form-control' id='name' placeholder='Name of Rider' value={name} onChange={(e)=>setName(e.target.value)} />
                    </div>
                    <div className='col-12 input-group'>
                        <div className='input-group-text'>+91</div>
                        <input className='form-control' id='number' type='number' placeholder='Contact Number' value={number} onChange={(e)=>setNumber(e.target.value)}/>
                    </div>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSehtsVQ8vB-8PfEJknQ6JPyhfSpHu66CL1s5CrrX8SUc9xjkg/viewform?usp=sf_link" target="_blank">Add Documents</a>
                </div>
                <button type='button' className='btn btn-primary' onClick={() => confirm(getRider)}>
                    Register
                </button>
            </form>
        </div>
    )
}

export default AddRider
