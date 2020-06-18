import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppStateType } from '../redux/store';
import { isMainThread } from 'worker_threads';

export function withAuthRedirect<WCP>(WrappedComponent: React.ComponentType<WCP>) {
    const RedirectComponent = (props: MapPropsType) => {
        const {isAuth, ...restProps} = props;
        if (!props.isAuth) return <Redirect to='/auth' />;
        return <WrappedComponent {...restProps as WCP} />;
    };

    const mapStateToProps = (state: AppStateType) => ({
        isAuth: state.auth.isAuth,
    });
    return connect<MapPropsType, {}, WCP, AppStateType>(mapStateToProps)(RedirectComponent);

    type MapPropsType = ReturnType<typeof mapStateToProps>;
}