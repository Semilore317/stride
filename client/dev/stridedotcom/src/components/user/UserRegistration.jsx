import React, {useEffect, useState} from 'react'
import {useDispatch} from "react-redux";
import {getUserById} from "@/store/features/userSlice.js";

const UserRegistration = () => {
    const [user, setUser] = useState({
        firstNAme: "",
        lastName: "",
        email: "",
        password: "",
    })

    const [addresses, setAddresses] = useState([
        {
            country: "",
            state: "",
            street: "'",
            addressType: "HOME"
        },
    ]);

    const handleUserChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    const handleAddressChange = (index, e) => {
        const {name, value} = e.target;
        const updatedAddresses = {...addresses};
        updatedAddresses[index] = {...updatedAddresses[index], [name]: value};
        setAddresses(updatedAddresses);
    }

    const addAddress = () => {
        setAddresses([
            ...addresses,
            {country: "", state: "", city: "", street: "", addressType: "HOME"},
        ]);
    }

    const removeAddress = (index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
    }
    return (
        <div>

        </div>
    )
}

export default UserRegistration;