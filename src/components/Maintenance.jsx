import React from 'react';
import DispenseBackground from '../assets/static_images/dispenseBackground.png';
import MaintenanceError from '../assets/static_images/payment_error.jpeg';
const Maintenance = () => {

    return <>
        <img 
            src={DispenseBackground} 
            style={{
                width: '100vw',
                height: '100vh'
            }} 
        />
        <div
            style={{
                position: 'absolute',
                width: 'max-content',
                height: 'max-content',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <img src={MaintenanceError} />
        </div>
    </>
}

export default Maintenance;