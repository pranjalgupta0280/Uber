import React, { createContext, useState } from 'react'

export const UserDataContext = createContext()

const UserContext = ({ children }) => {
    // 1. Matched property names to backend schema (fullname, firstname, lastname)
    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstname: '',
            lastname: ''
        }
    })

    return (
        // 2. Removed the unnecessary <div> wrapper to keep the DOM clean
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserContext