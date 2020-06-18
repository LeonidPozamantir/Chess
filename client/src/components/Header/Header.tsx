import React from 'react';
import s from './Header.module.css';
import { connect } from 'react-redux';
import { AppStateType } from '../../redux/store';

export const Header: React.FC<PropsType> = (props) => {
    return <div className={s.header}>
        {props.isAuth && <div className={s.rightBlock}>
            Shalom, {props.userName}
            <button onClick={() => alert('logout')}>Logout</button>
        </div>}
    </div>;
};

const mapStateToProps = (state: AppStateType) => ({
    isAuth: state.auth.isAuth,
    userName: state.auth.userName,
});

export default connect<MapPropsType, {}, {}, AppStateType>(mapStateToProps)(Header);

type MapPropsType = ReturnType<typeof mapStateToProps>;
type PropsType = MapPropsType;