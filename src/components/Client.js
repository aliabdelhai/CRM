import React, { useState } from 'react';
import { observer, inject } from 'mobx-react'
import '../styles/client.css';
import Popup from "./Popup";

function Client(props) {

    const [showUp, setShowUp] = useState(false)
    const sold = props.client.sold ? <i className="fas fa-check" /> : "-"

    const getFormmatedDate = date => {
        date = new Date(date);
        let day = date.getDate() - 1;
        const month = date.toLocaleString('en-us', { month: 'long' });
        let year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    const handlePopUp = () => {
        setShowUp(!showUp)
    }


    return (
        <div>
            {showUp ? <Popup close={handlePopUp} name={props.client.first} surName={props.client.last} country={props.client.country} client={props.client} /> : null}
            <div className="client" onDoubleClick={() => handlePopUp()} >
                <span>{props.client.first}</span>
                <span>{props.client.last}</span>
                <span>{props.client.country}</span>
                <span>{getFormmatedDate(props.client.date)}</span>
                <span>{props.client.email_type}</span>
                <span>{sold}</span>
                <span>{props.client.owner}</span>
            </div>
        </div>
    )

}

export default inject("clientsStore")(observer(Client))