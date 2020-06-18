import React from 'react';
import s from './App.module.css';
import { Route } from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage';
import Header from './components/Header/Header';
import { Navbar } from './components/Navbar/Navbar';
import GamePage from './components/GamePage/GamePage';
import Preloader from './components/common/Preloader/Preloader';
import { connect } from 'react-redux';
import { AppStateType } from './redux/store';
import { getAuthUserData } from './redux/auth-reducer';

class App extends React.Component<PropsType> {

    componentDidMount() {
        this.props.getAuthUserData();
    }

    render() {
        return (
            <div className={s.app}>
                <Header />
                <Navbar />
                <div className={s.content}>
                    {/* <Preloader /> */}
                    <Route path='/auth' render={() => <AuthPage />} />
                    <Route path='/game' render={() => <GamePage />} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType) => ({

});

export default connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, { getAuthUserData })(App);

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    getAuthUserData: () => void,
};
type PropsType = MapPropsType & DispatchPropsType;