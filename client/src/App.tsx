import React from 'react';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import { AuthPage } from './components/AuthPage/AuthPage';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <NavLink to='/auth'>Authorization</NavLink>
                <Route path='/auth' render={() => <AuthPage />} />
            </BrowserRouter>
        </div>
    );
}

export default App;
