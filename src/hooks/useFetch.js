const apiCall = async (URL, 
    method = 'GET', 
    params = null, 
    headers = {'Content-Type': 'application/json'},
    responseType = 'json',
    onUploadProgress = null
    ) => {
        let response, error
        try{
            const res = await fetch(URL, {
                method,
                body: method !== 'GET' ? JSON.stringify(params) : undefined,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                responseType,
                onUploadProgress: onUploadProgress ? (e) => onUploadProgress(e) : null
            })
            response = await res.json()
        } catch(err){
            console.log(error)
        } finally{
            return { response, error }
        }
    
};

export default apiCall;
