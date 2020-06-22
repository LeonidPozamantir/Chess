import React from 'react';
import s from './App.module.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import GamePage from './components/GamePage/GamePage';
import Preloader from './components/common/Preloader/Preloader';
import { connect } from 'react-redux';
import { AppStateType } from './redux/store';
import { initializeApp } from './redux/appReducer';

class App extends React.Component<PropsType> {

    componentDidMount() {
        this.props.initializeApp();
    }

    render() {
        if (!this.props.initialized) return <Preloader />;
        return (
            <div className={s.app}>
                <Header />
                <Navbar />
                <div className={s.content}>
                    <Switch>
                        <Route path='/auth' render={() => <AuthPage />} />
                        <Route path='/game' render={() => <GamePage />} />
                        <Route path='*' render={() => (this.props.initialized ? <Redirect to={'/game'} /> : <Redirect to={'/auth'} />)} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType) => ({
    initialized: state.app.initialized,
});

export default connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, { initializeApp })(App);

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    initializeApp: () => void,
};
type PropsType = MapPropsType & DispatchPropsType;