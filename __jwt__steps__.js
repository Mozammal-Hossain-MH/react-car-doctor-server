/**
 * 1. install jsonwebtoken
 * 2. jwt.sign(payload, secret, {expiresIn: ''})
 * 3. token client
 * 
 */

/***
 * How to store token in the client side
 * 1. Memory --> ok type
 * 2. Localstorage --> ok type
 * 3. cookie --> http only
 */

/**
 * 1. set cookie with http only. For development secure: false
 * 2. cors
*   app.use(cors({
        origin:['http://localhost:5173/'],
        credentials: true
    }))
    
 * 3. client side axios setting
 * */


    /**
     * 1. To send cookies from the client make sure you use withCredentials: true for the api call usng axios
     * 2. use cookieparser as middleware
     * */ 
