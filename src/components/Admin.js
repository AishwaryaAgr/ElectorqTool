/** @format */

import React, { useState } from 'react';
import RegDriver from './AdminComponents/RegDriver';
import TakeRent from './AdminComponents/TakeRent';
import AddRider from './AdminComponents/AddRider';
import AddError from './AdminComponents/AddError';
import RemoveRider from './AdminComponents/RemoveRider';
import ReplaceStuff from './AdminComponents/ReplaceStuff';
import Repair from './AdminComponents/Repair';
import UnderMaintenance from './AdminComponents/UnderMaintenance';
import Instant from './AdminComponents/Instant';

const Admin = ({ API_URL }) => {
	const [task, setTask] = useState('Rider'); // State Variables Used as a flag to Decide what to render
	return (
		<>
			<nav className='navbar navbar-expand-lg navbar-fixed  p-2'>
				<div className=' h4 navbar-brand mt-4 mx-3'>Electorq</div>
				{/* Displaying buttons for all possible options in the rider management portal */}
				<div className='navbar-nav flex flex-row'>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Rider')}>Assign Rider</button>  {/* Assigning a vehicle and battery to rider simultaneously*/}
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Add')}>Add Rider</button> {/* Adding a new rider with documents to the DB */}
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Replace')}>Replace Component</button> {/* Replace any component that is currently possessed by a rider */}
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Repair')}>Repaired Component</button> {/* Mark a previously out of service component as working */}
				</div>
				<div className='navbar-nav flex flex-row'>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Remove')}>Remove Rider</button> {/* Delete rider from DB */}
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Rent')}>Take Rent </button> {/* Mark rent as paid for any occupied vehicle */}
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Under')}>Send for Maintenance</button> {/* Mark an unoccupied component as down */}
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Error')}>Add Comment</button> {/* Comment on an up or down request */}
				</div>
				<div className='navbar-nav flex flex-row'>
					<button className='mx-1 nav-item active bg-warning btn' onClick={() => setTask('Instant')}>Instant Complaint</button> {/* Comment on an up Item */}
				</div>
			</nav>
			{(() => {
				// Conditional Rendering based on the value of task
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
				else if(task === "Instant"){
				    return <Instant API_URL={API_URL}/>
				}
				else return <TakeRent API_URL={API_URL} setTask={setTask} />; // setTask is sent as an argument to enable Take Rent to change task and render payment window for Rent
			})()}
		</>
	);
};

export default Admin;
