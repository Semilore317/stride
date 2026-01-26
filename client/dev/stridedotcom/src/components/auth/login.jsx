import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginUser} from "@/store/features/authSlice.js";
import {toast} from "react-toastify";

const login = () =>{
    const [credentials, setCredentials] = useState(
        email: "",
        password: "",
    );

    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
                [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if(!credentials.email || !credentials.password) {
            toast.error("Invalid username or password");
            return;
        }
        try{
            dispatch(loginUser(credentials.email, credentials.password));
        }catch (error){
            toast.error(error.message);
        }
    }
    return(
        <div>

        </div>
    )
}

export default login;