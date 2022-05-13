import { BrowserRouter, Routes, Route } from "react-router-dom"

import SignIn from './components/SingIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Admin/Dashboard'
import Home from './components/User/Home'

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignIn />} />   // default route
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/home" element={<Home />} />
            </Routes> 
        </BrowserRouter>
    )

}

export default App