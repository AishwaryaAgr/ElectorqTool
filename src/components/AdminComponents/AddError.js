import React, {useState} from 'react'

const AddError = ({API_URL}) => {
    const [number, setNumber] = useState("");
    const [description, setDescription] = useState("");
    const [method, setmethod] = useState("solution");

    const submit = () => {
        if(number.length > 3 || number.length < 2)
            return alert("Invalid Component Id");
        // fetch(`${API_URL}/components/${method}`, {
        fetch(`${API_URL}/components/${method}/${number}/${description}`, {
		}).then(() => {
            setNumber("");
            setDescription("");
            setmethod("solution");
            return alert('Database Updated');})
        .catch(e=> console.log(e));
    }
    const confirm = (cb) => {
    const confirmBox = window.confirm( "Do you want to continue" )
    if (confirmBox === true) {
      cb();
    }
  }
    

    return (
        <div className='container '
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f5f5f5',
					borderRadius: '10px',
				}}>
            <form type="submit">
               <div className='col-12'>
                    <div className='col-12 input-group'>
                        <select className='form-select' id='type' onChange={e=> setmethod(e.target.value)}>
                            <option defaultValue value='solution'>
                                For Repaired Item
                            </option>
                            <option value='error'>
                                For Item Under Maintenance
                            </option>
                        </select>
                        <input className='form-control' id='number' placeholder='Component Id' value={number} onChange={(e)=>setNumber(e.target.value)}/>
                    </div>
                    <div className='col-12 input-group'>
                        <input className='form-control' id='desc' placeholder='Add Comment' value={description} onChange={(e)=>setDescription(e.target.value)}/>
                    </div>
                </div>
                <button type='button' className='btn btn-primary' onClick={() => confirm(submit)}>
                    Add Comment
                </button>
            </form>
        </div>
    )
}

export default AddError
