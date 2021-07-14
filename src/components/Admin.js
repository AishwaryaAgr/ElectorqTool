/** @format */

import React, { useState } from 'react';
import RegDriver from './AdminComponents/RegDriver';
// import RegBattery from './AdminComponents/RegBattery'
import TakeRent from './AdminComponents/TakeRent';
import AddRider from './AdminComponents/AddRider';
import AddError from './AdminComponents/AddError';
import RemoveRider from './AdminComponents/RemoveRider';
import ReplaceStuff from './AdminComponents/ReplaceStuff';
import Repair from './AdminComponents/Repair';
import UnderMaintenance from './AdminComponents/UnderMaintenance';

const Admin = ({ API_URL }) => {
	const [task, setTask] = useState('Rider');
	return (
		<>
			<nav className='navbar navbar-expand-lg navbar-fixed  p-2'>
				<div className=' h4 navbar-brand mt-4 mx-3'>Electorq</div>
				<div className='navbar-nav flex flex-row'>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Rider')}>
						Assign Rider
					</button>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Add')}>Add Rider</button>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Replace')}>Replace Component</button>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Repair')}>Repaired Component</button>
				</div>
				<div className='navbar-nav flex flex-row'>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Remove')}>Remove Rider</button>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Rent')}>Take Rent </button>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Under')}>Send for Maintenance</button>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Error')}>Add Comment</button>
					
				</div>
			</nav>
			{(() => {
				if (task === 'Rider') {
					return <RegDriver API_URL={API_URL} />;
				}
				else if(task === "Add"){
				    return <AddRider API_URL={API_URL}/>
				}
				else if(task === "Replace"){
				    return <ReplaceStuff API_URL={API_URL}/>
				}
				else if(task === "Remove"){
				    return <RemoveRider API_URL={API_URL}/>
				}
				else if(task === "Repair"){
				    return <Repair API_URL={API_URL}/>
				}
				else if(task === "Under"){
				    return <UnderMaintenance API_URL={API_URL}/>
				}
				else if(task === "Error"){
				    return <AddError API_URL={API_URL}/>
				}
				else return <TakeRent API_URL={API_URL} setTask={setTask} />;
			})()}
		</>
	);
};

export default Admin;
