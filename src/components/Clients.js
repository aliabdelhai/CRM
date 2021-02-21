import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react'
import '../styles/clients.css';
import Client from "./Client";
import axios from "axios";

function Clients(props) {
    const [search, setSearch] = useState("")
    const [select, setSelect] = useState("first")


    const handleSearch = (e) => {
        setSearch(e.target.value)


    }
    const handleSelect = (e) => {
        setSelect(e.target.value)
    }

    useEffect(async () => {
        let clientsData = await axios.get('/clients')
        props.clientsStore.clients = clientsData.data
    }, [])



    return (
        <div>
            <div id="search-nav">
                <input
                    placeholder="Search"
                    id="search"
                    value={search}
                    onChange={handleSearch}
                />
                <select id="selectInput" value={select} onChange={handleSelect}>
                    <option value="first">Name</option>
                    <option value="country">Country</option>
                    <option value="owner">Owner</option>
                    <option value="sold">Sold</option>
                </select>
            </div>
            <div id="header" >
                <span>Name</span>
                <span>Surname</span>
                <span>Country</span>
                <span>First Contact</span>
                <span>Email</span>
                <span>Sold</span>
                <span>Owner</span>
            </div>
            <div id ='clients'>
            {search === "" && select == 'sold'
                ? props.clientsStore.clients.filter(fd => fd[select]).map(c => <Client key={c._id} client={c} />)
                : search === ""
                    ? props.clientsStore.clients.map(c => <Client key={c._id} client={c} />)
                    : props.clientsStore.clients.filter(fd =>
                        fd[select]
                            .toUpperCase()
                            .toLowerCase()
                            .includes(search))
                        .map(c => <Client key={c._id} client={c} />)
            }
            </div>


        </div>
    )

}

export default inject("clientsStore")(observer(Clients))