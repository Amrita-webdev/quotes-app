import React, {useReducer, useEffect} from 'react'
import apiCall from '../hooks/useFetch'
import Modal from './CreateQuote'
import '../App.css';

const initialState = {
    loading: false,
    data: [],
    error: null,
    limit: 20,
    offset: 0,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    },
    showModal: false
}

const reducer = (state, action) => {
    console.log('Action received:', action)
    switch(action.type){
        case "SET_LOADING":
            return { ...state, loading: action.payload }
        case "SET_DATA":
            return { ...state, data: action.payload }
        case "SET_ERROR":
            return { ...state, error: action.payload }
        case "SET_LIMIT":
            return { ...state, limit: action.payload }
        case "SET_OFFSET":
            return { ...state, offset: action.payload }
        case 'SET_PAGINATION':
            return {
                ...state,
                pagination: {
                ...state.pagination,
                ...action.payload,
                },
            };
        case "SET_SHOWMODAL":
            return { ...state, showModal: action.payload }
        default:
            return state;
    }
}

const QuotesComponent = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {loading, data, error, limit, offset, showModal} = state

    const dateFormatter = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    const fetchQuotes = async () => {
        try{
            dispatch({ type: 'SET_LOADING', payload: true})
            const token = localStorage.getItem('authToken')
            console.log(token)
            if (!token) {
                console.error("Auth token missing");
                dispatch({ type: 'SET_ERROR', payload: "Auth token missing" });
                return;
            }
            const {response, error} = await apiCall(`https://assignment.stage.crafto.app/getQuotes?limit=${limit}&offset=${offset}`, "GET", undefined, {Authorization: `${token}`})
            if (error) {
                console.error("API call error:", error);
                dispatch({ type: 'SET_ERROR', payload: error });
                return;
            }
            if (!response?.data) {
                console.error("Invalid response structure", response);
                dispatch({ type: 'SET_ERROR', payload: "Invalid response structure" });
                return;
            }
            dispatch({ type: 'SET_DATA', payload: response });
            console.log(response.data[0].mediaUrl)
            console.log(data)

        } catch(err){
            dispatch({ type: 'SET_ERROR', payload: err.message})
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false})
        }
    }
    const handleShowModal = () => {
        dispatch({ type: 'SET_SHOWMODAL', payload: true})
    };

    const handleCloseModal = () => {
        dispatch({ type: 'SET_SHOWMODAL', payload: false})
    };

    useEffect(() =>{
        fetchQuotes()
    }, [])
    
    return (
        <>
            <header className="header">
                <p>Welcome! User</p>
            </header>
            <div className="table__container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Text</th>
                            <th>Created Date</th>
                            <th>Media</th>
                            <th>Updated Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.data && data?.data.map((tableData) => {
                            return (
                                <tr key={tableData?.id}>
                                    <td>{tableData?.id}</td>
                                    <td>{tableData?.username}</td>
                                    <td>{tableData?.text}</td>
                                    <td>{dateFormatter(tableData?.createdAt)}</td>
                                    <td><img src={tableData?.mediaUrl} alt="Media URL" /></td>
                                    <td>{dateFormatter(tableData?.updatedAt)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="floating-add-button">
                <button className="floating-button" onClick={handleShowModal}>
                    <span>+</span>
                    <span>Add Quote</span>
                </button>
            </div>
            {showModal && <Modal showModal={showModal} closeModal={handleCloseModal} />}
        </>
    )
}

export default QuotesComponent