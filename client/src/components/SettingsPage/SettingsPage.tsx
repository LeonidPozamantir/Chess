import React from 'react';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { getStringKeys, createField, Input } from '../common/FormControls/FormControls';
import { required } from '../../utils/validators';
import s from './SettingsPage.module.css';
import { connect } from 'react-redux';
import { AppStateType } from '../../redux/store';
import { saveSettings, actions, saveProfilePicture } from '../../redux/authReducer';
import ProfilePicture from './ProfilePicture';

class SettingsPage extends React.Component<PropsType> {

    componentDidMount() {
        this.props.setProfileSaved(false);
    }

    handleSave = (formData: SettingsFormValuesType) => {
        this.props.saveSettings(formData.email as string, formData.rating);
    };

    render() {
        const { email, rating, profilePicture, saveProfilePicture, errorMessageSavingPicture, setErrorSavingPicture } = this.props;
        return <div className={s.settingsPage}>
            <h1>Settings</h1>
            <ProfilePicture profilePicture={profilePicture} saveProfilePicture={saveProfilePicture} 
                    errorMessageSavingPicture={errorMessageSavingPicture} setErrorSavingPicture={setErrorSavingPicture} />
            <SettingsFormRedux onSubmit={this.handleSave} initialValues={{ email, rating }} wasSaved={this.props.wasSaved} />
        </div>;
    }
    
};

const SettingsForm: React.FC<InjectedFormProps<SettingsFormValuesType, FormOwnPropsType> & FormOwnPropsType> = (props) => {
    return <form className={s.settingsBlock} onSubmit={props.handleSubmit}>
        {createField<SettingsFormKeysType>('Email', 'email', Input, [required], {type: 'text'})}
        {createField<SettingsFormKeysType>('Fide rating', 'rating', Input, [], {type: 'number'})}
        {props.pristine && props.wasSaved && <div className={s.saved}>Successfully saved</div>}
        <button disabled={props.pristine}>Save</button>
    </form>
};

const SettingsFormRedux = reduxForm<SettingsFormValuesType, FormOwnPropsType>({ form: 'settings', enableReinitialize: true })(SettingsForm);


const mapStateToProps = (state: AppStateType) => ({
    email: state.auth.email,
    rating: state.auth.rating,
    wasSaved: state.auth.wasSaved,
    profilePicture: state.auth.profilePicture,
    errorMessageSavingPicture: state.auth.errorMessageSavingPicture,
});

export default withAuthRedirect(connect<MapPropsType, DispatchPropsType, {}, AppStateType>(
    mapStateToProps, { saveSettings, setProfileSaved: actions.setProfileSaved, saveProfilePicture, setErrorSavingPicture: actions.setErrorSavingPicture })(SettingsPage));

type SettingsFormValuesType = {
    email: string | null,
    rating: number | null,
    profilePicture: string | null,
};
type SettingsFormKeysType = getStringKeys<SettingsFormValuesType>;

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    saveSettings: (email: string, rating: number | null) => void,
    setProfileSaved: (saved: boolean) => void,
    saveProfilePicture: (pictureFile: File) => void,
    setErrorSavingPicture: (isErrorSavingPicture: string | null) => void,
};
type FormOwnPropsType = {
    wasSaved: boolean,
};
type PropsType = MapPropsType & DispatchPropsType;