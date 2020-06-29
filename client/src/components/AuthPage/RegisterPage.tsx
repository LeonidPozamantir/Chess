import React from 'react';
import s from './AuthPage.module.css';
import { createField, Input, getStringKeys } from '../common/FormControls/FormControls';
import { required } from '../../utils/validators';
import { reduxForm, InjectedFormProps } from 'redux-form';
import { AppStateType } from '../../redux/store';
import { connect } from 'react-redux';
import { register } from '../../redux/authReducer';
import formStyle from '../common/FormControls/FormControls.module.css';
import { Redirect } from 'react-router-dom';

const RegisterPage: React.FC<PropsType> = ({ isAuth, register }) => {
    const handleRegister = (formData: RegisterFormValuesType) => {
        register(formData.userName, formData.password, formData.email, formData.rememberMe);
    };

    if (isAuth) return <Redirect to='/game' />
    return <div className={s.form}>
        <h1>Register</h1>
        <RegisterFormRedux onSubmit={handleRegister}/>
    </div>
};

const RegisterForm: React.FC<InjectedFormProps<RegisterFormValuesType>> = (props) => {
    return <form onSubmit={props.handleSubmit}>
        {props.error && <div className={formStyle.formSummaryError}>{props.error}</div>}
        {createField<RegisterFormKeysType>('User name', 'userName', Input, [required], {type: 'text'})}
        {createField<RegisterFormKeysType>('Password', 'password', Input, [required], {type: 'password'})}
        {createField<RegisterFormKeysType>('Email', 'email', Input, [required], {type: 'text'})}
        {createField<RegisterFormKeysType>(undefined, 'rememberMe', Input, [], {type: 'checkbox'}, 'Remember me')}
        <button>Register</button>
    </form>
};

const RegisterFormRedux = reduxForm<RegisterFormValuesType>({ form: 'register' })(RegisterForm);

const mapStateToProps = (state: AppStateType) => ({
    isAuth: state.auth.isAuth,
});

export default connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, { register })(RegisterPage);

type RegisterFormValuesType = {
    userName: string,
    password: string,
    email: string,
    rememberMe: boolean,
};
type RegisterFormKeysType = getStringKeys<RegisterFormValuesType>;
type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    register: (userName: string, password: string, email: string, rememberMe: boolean) => void,
};
type PropsType = MapPropsType & DispatchPropsType;