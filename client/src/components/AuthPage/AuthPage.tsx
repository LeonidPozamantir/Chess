import React from 'react';
import { reduxForm, InjectedFormProps } from 'redux-form';
import { required } from '../../utils/validators';
import { Input, createField, getStringKeys } from '../common/FormControls/FormControls';
import { login } from '../../redux/authReducer';
import formStyle from '../common/FormControls/FormControls.module.css';
import { AppStateType } from '../../redux/store';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import s from './AuthPage.module.css';

const Login = (props: PropsType) => {
    const handleLogin = (formData: LoginFormValuesType) => {
        props.login(formData.userName, formData.password, formData.rememberMe);
    };
    
    if (props.isAuth) return <Redirect to='/game' />
    return <div className={s.form}>
        <h1>Login</h1>
        <LoginFormRedux onSubmit={handleLogin}/>
    </div>;
};

const LoginForm: React.FC<InjectedFormProps<LoginFormValuesType>> = (props) => {
    
    return <form onSubmit={props.handleSubmit}>
        {props.error && <div className={formStyle.formSummaryError}>{props.error}</div>}
        {createField<LoginFormKeysType>('User name', 'userName', Input, [required], {type: 'text'})}
        {createField<LoginFormKeysType>('Password', 'password', Input, [required], {type: 'password'})}
        {createField<LoginFormKeysType>(undefined, 'rememberMe', Input, [], {type: 'checkbox'}, 'Remember me')}
        <button type='submit'>Sign in</button>
    </form>
};

const LoginFormRedux = reduxForm<LoginFormValuesType>({ form: 'login' })(LoginForm);

const mapStateToProps = (state: AppStateType) => ({
    isAuth: state.auth.isAuth,
});

export default connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, {login})(Login);

type LoginFormValuesType = {
    userName: string,
    password: string,
    rememberMe: boolean,
};
type LoginFormKeysType = getStringKeys<LoginFormValuesType>;
type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    login: (username: string, password: string, rememberMe: boolean) => void,
};
type PropsType = MapPropsType & DispatchPropsType;