import React, {useState} from 'react'
import Give from './Give';
import Payment from "./Payment"

const Swap = ({API_URL}) => {
    let absent = {
		name: "Not assigned",
		number: 0,
		pendingSwapPayment: 0,
		scooterId: 0
	}
    const [rider, setRider] = useState(absent);
    const [current, setCurrent] = useState({});
    const [task, setTask] = useState(false);


    if (!task)
		return (
			<>
                <Give API_URL={API_URL} setRider={setRider} setTask={setTask} current={current} absent={absent} setCurrent={setCurrent} rider={rider}/>
			</>
		);
	else
		return (
			<>
				<Payment API_URL={API_URL} setRider={setRider} setTask={setTask} current={current} absent={absent} setCurrent={setCurrent} rider={rider} />
			</>
		);
}

export default Swap
