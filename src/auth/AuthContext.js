import { createContext, useContext, useReducer } from 'react' 

const AuthContext = createContext() 

export const useAuth = () => {
    return useContext(AuthContext)
}

const reducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN' : {
            return {...state, isLoggedIn: true, account: action.payload.account }
        }
        case 'LOGOUT' : {
            return {...state, isLoggedIn: false, account: null } 
        }
        case 'USER' : {
            return {...state, user: action.payload }
        }
        case 'ALL' : {
            return {...state, blogs:action.payload }
        }
        default: {
            return {...state} 
        }
    }
}

export const AuthProvider = ({ children }) => {
    const [user, dispatch] = useReducer(reducer, {
        isLoggedIn: false, 
        account: null,
    })
   

    return (
        <AuthContext.Provider value={{ user, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}