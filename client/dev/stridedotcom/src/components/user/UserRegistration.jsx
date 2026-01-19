import React, {useEffect} from 'react'
import {useDispatch} from "react-redux";
import {getUserById} from "@/store/features/userSlice.js";

const UserRegistration = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserById(2));
    })
    return (
        <div>

        </div>
    )
}

export default UserRegistration;