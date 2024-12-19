import React, {useReducer} from 'react'
import apiCall from '../hooks/useFetch';
import { useNavigate } from "react-router-dom";
import '../App.css';

const initialState = {
    loading: false,
    username: "",
    otp: "",
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING": 
            return { ...state, loading: action.payload }
        case "SET_USERNAME":
            return { ...state, username: action.payload, error: null };
        case "SET_OTP":
            return { ...state, otp: action.payload, error: null };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "RESET":
            return initialState;
        default:
            return state;
    }
};


const Login = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate()
    const { username, otp, loading, error } = state;
    

    const handleSubmit =  async (e) => {
        
        e.preventDefault();

        if (!username || !otp) {
            dispatch({ type: "SET_ERROR", payload: "All fields are required." });
            return;
        }
    
        if (otp.length !== 4) {
            dispatch({ type: "SET_ERROR", payload: "OTP must be 4 digits" });
            return;
        }

        try {
            dispatch({ type: "SET_LOADING", payload: true })
            const params = {username, otp}
            const {response, error} =await apiCall(`https://assignment.stage.crafto.app/login`, "POST", params, {})
            
            if (response) { // Check for a valid response
                console.log(response, 'data')
                localStorage.setItem("authToken", response.token);
                navigate("/quotes"); // Navigate to quotes page
            } else {
                dispatch({ type: "SET_ERROR", payload: error });;
            }
        } catch (err) {
            console.error("Login error:", err);
            dispatch({ type: "SET_ERROR", payload: err });
        } finally{
            dispatch({ type: "SET_LOADING", payload: false })
        }
    };
    
    return (
        <div className="login__container">
            <div className="login__container__inner">
                <div className="login__text">
                    <h3>Log in to your account</h3>
                    <p>Welcome back! Please enter your details</p>
                </div>
                
                    <form onSubmit={handleSubmit}>
                        <div className="login__form">
                            <div className="logininput">
                                <label>Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => dispatch({ type: "SET_USERNAME", payload: e.target.value })}
                                />
                            </div>
                            <div className="logininput">
                                <label>OTP</label>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => dispatch({ type: "SET_OTP", payload: e.target.value })}
                                />
                            </div>
                            {error && <p className="error__message">{error}</p>}
                            <div className="button">
                                <button type="submit" className="submit__button" >
                                    {loading ? "Logging in..." : "Log in"}
                                </button>
                            </div>
                        </div>
                    </form>
            </div>
        </div>
    )

}

export default Login