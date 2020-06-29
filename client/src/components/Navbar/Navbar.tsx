import React from 'react';
import s from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return <nav className={s.navbar}>
        <div className={s.item}>
            <NavLink to='/auth' activeClassName={s.active}>Login</NavLink>
        </div>
        <div className={s.item}>
            <NavLink to='/register' activeClassName={s.active}>Register</NavLink>
        </div>
        <div className={s.item}>
            <NavLink to='/game' activeClassName={s.active}>Game</NavLink>
        </div>
        <div className={s.item}>
            <NavLink to='/settings' activeClassName={s.active}>Settings</NavLink>
        </div>
    </nav>;
};

export default Navbar;