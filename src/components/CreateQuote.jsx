import React, { useReducer } from 'react';
import apiCall from '../hooks/useFetch';  // Import the custom apiCall utility
import '../App.css';

const API_BASE_URL = 'https://assignment.stage.crafto.app';
const IMAGE_UPLOAD_URL = 'https://crafto.app/crafto/v1.0/media/assignment/upload';

const initialState = {
    text: '',
    image: null,
    loading: false,
    imageUrl: '',
    addQuote: []
}

const reducer = (state, action) =>{
    switch(action.type){
        case 'SET_TEXT':
            return { ...state, text: action.payload}
        case 'SET_IMAGE':
            return { ...state, image: action.payload}
        case 'SET_LOADING':
            return { ...state, loading: action.payload}
        case 'SET_IMAGEURL':
            return { ...state, imageUrl: action.payload}
        case "ADD_QUOTE":
            return { 
                ...state, 
                data: {
                    ...state.data,
                    data: [action.payload, ...state.data.data] // Add the new quote at the start
                }
            };
        default:
            return state
    }
}

const Modal = ({ showModal, closeModal }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {image, text, loading, imageUrl} = state

    const handleImageChange = (e) => {
        dispatch({ type: 'SET_IMAGE', payload: e.target.files[0] })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text || !image) return;
    
        dispatch({ type: 'SET_LOADING', payload: true})
    
        try {
            const formData = new FormData();
            formData.append('file', image);
            const { response: imageResponse } = await apiCall(
                IMAGE_UPLOAD_URL,
                'POST',
                formData,
                {},
                'json'
            );
            const uploadedImageUrl = imageResponse?.mediaUrl || `https://media.crafto.app/home/900x900/4653c87a-83f8-4326-afa0-1a06086550ef?dimension=900x900`;
    

            const quoteData = { text, mediaUrl: uploadedImageUrl };
            const token = localStorage.getItem('authToken');
            const { response: quoteResponse } = await apiCall(
                `${API_BASE_URL}/postQuote`,
                'POST',
                quoteData,
                { Authorization: `${token}` }
            );

            if (quoteResponse?.data) {
                dispatch({ type: 'ADD_QUOTE', payload: quoteResponse.data });
                closeModal();
            }
        } catch (error) {
            console.error("Error while adding quote:", error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false})
        }
    };
    

    return (
        <div className={`modal ${showModal ? 'show' : ''}`}>
            <div className="modal-content">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    
                    <h2>Add a Quote</h2>
                    <span className="close" onClick={closeModal}>&times;</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                    <div className="quoteinput">
                        <label>Text</label>
                        <textarea
                            value={text}
                            onChange={(e) => dispatch({ type: 'SET_TEXT', payload: e.target.value })}
                            placeholder="Enter quote text"
                            rows="4"
                        />
                    </div>
                    <div className="quoteinput">
                        <label>Upload Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className="button">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Uploading...' : 'Add Quote'}
                        </button>
                    </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
