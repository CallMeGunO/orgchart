import { createContext } from 'react'

const defaultState = {
    app: {
        name: 'default',
        options: {},
        automaticDataCollectionEnabled: false
    }
}

const FirebaseContext = createContext(defaultState)

export default FirebaseContext
