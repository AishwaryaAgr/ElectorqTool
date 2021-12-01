/** @format */
import React, { useState } from 'react';
import Admin from './components/Admin';
import './App.css';
import Swap from './components/SwapPartner/Swap';

function App() {
	const [password, setPassword] = useState('');
	const [incorrect, setIncorrect] = useState(false);
	let API_URL = 'https://electorqtool.herokuapp.com/api';
	const p1 = 'st12tt';
	const p2 = 'st12rms';
	const p3 = 'st421t';
	const p4 = 'mpp2tt';

	const check = () => {
		const entry = document.querySelector('#pass').value;
		if (entry === 'El3Torq') setPassword('0');
		if (entry === 'Vehicl3') setPassword('1');
		if (entry === 'Scoot3r') setPassword('2');
		else if (entry === p1 || entry === p2 || entry === p3 || entry === p4) setPassword('Swap');
		else setIncorrect(true);
	};

	return (
		<>
			{(() => {
				if (password === '')
					return (
						<div className='global-container'>
							<div className='card login-form'>
								<div className='card-body'>
									<h3 className='card-title text-center'>Welcome</h3>
									<div className='card-text'>
										{(() => {
											if (incorrect)
												return (
													<div
														className='alert alert-danger alert-dismissible fade show'
														role='alert'>
														Incorrect password.
													</div>
												);
										})()}
										<form>
											<div className='form-group'>
												<label for='exampleInputPassword1'>Admin Password</label>
												<input
													type='password'
													className='form-control form-control-sm'
													id='pass'
												/>
											</div>
											<button
												type='button'
												className='btn btn-primary btn-block'
												onClick={() => check()}>
												Sign in
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					);

				if (password === '0' || password === '1' || password === '2' ) return <Admin API_URL={API_URL} password={password}/>;
				if (password === 'Swap') return <Swap API_URL={API_URL} />;
			})()}
		</>
	);
}

export default App;
