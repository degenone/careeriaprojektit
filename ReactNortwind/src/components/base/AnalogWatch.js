import React, { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

 
function AnalogWatch() {
    const [value, setValue] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(
            () => setValue(new Date()),
            1000
        );

        return () => {
            clearInterval(interval);
        }
    }, []);

    return <><Clock value={value} renderNumbers={true}/></>;
}

export default AnalogWatch;