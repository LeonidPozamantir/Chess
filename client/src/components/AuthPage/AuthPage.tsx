import React from 'react';
import { reduxForm, InjectedFormProps } from 'redux-form';
import { required } from '../../utils/validators';
import { Input, createField, getStringKeys } from '../common/FormControls/FormControls';
import { login } from '../../redux/auth-reducer';
import formStyle from '../common/FormControls/FormControls.module.css';
import { AppStateType } from '../../redux/store';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Login = (props: PropsType) => {
    const handleLogin = (formData: LoginFormValuesType) => {
        props.login(formData.userName, formData.password);
    };
    
    if (props.isAuth) return <Redirect to='/game' />
    return <div>
        <h1>Login</h1>
        <LoginFormRedux onSubmit={handleLogin}/>
    </div>;
};

const LoginForm: React.FC<InjectedFormProps<LoginFormValuesType>> = (props) => {
    
    return <form onSubmit={props.handleSubmit}>
        {props.error && <div className={formStyle.formSummaryError}>{props.error}</div>}
        {createField<LoginFormKeysType>('User name', 'userName', Input, [required], {type: 'text'})}
        {createField<LoginFormKeysType>('Password', 'password', Input, [required], {type: 'password'})}
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
};
type LoginFormKeysType = getStringKeys<LoginFormValuesType>;
type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    login: (username: string, password: string) => void,
};
type PropsType = MapPropsType & DispatchPropsType;