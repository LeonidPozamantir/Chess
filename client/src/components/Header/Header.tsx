import React from 'react';
import s from './Header.module.css';
import { connect } from 'react-redux';
import { AppStateType } from '../../redux/store';
import { logout } from '../../redux/authReducer';

const Header: React.FC<PropsType> = (props) => {
    const handleLogout = () => {
        props.logout();
    };

    return <div className={s.header}>
        {props.isAuth && <div className={s.rightBlock}>
            Shalom, {props.userName}
            <button onClick={handleLogout}>Logout</button>
        </div>}
    </div>;
};

const mapStateToProps = (state: AppStateType) => ({
    isAuth: state.auth.isAuth,
    userName: state.auth.userName,
});

export default connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, {logout})(Header);

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    logout: () => void,
};
type PropsType = MapPropsType & DispatchPropsType;