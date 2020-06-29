import React from 'react';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { getStringKeys, createField, Input } from '../common/FormControls/FormControls';
import { required } from '../../utils/validators';
import s from './SettingsPage.module.css';
import { connect } from 'react-redux';
import { AppStateType } from '../../redux/store';
import { getUserProfile, saveSettings, actions } from '../../redux/profileReducer';

class SettingsPage extends React.Component<PropsType> {

    componentDidMount() {
        this.props.getUserProfile();
        this.props.setProfileSaved(false);
    }

    handleSave = (formData: SettingsFormValuesType) => {
        this.props.saveSettings(formData.email as string, formData.rating);
    };

    render() {
        const { email, rating } = this.props;
        return <div className={s.settingsPage}>
            <h1>Settings</h1>
            <SettingsFormRedux onSubmit={this.handleSave} initialValues={{ email, rating }} wasSaved={this.props.wasSaved} />
        </div>;
    }
    
};

const SettingsForm: React.FC<InjectedFormProps<SettingsFormValuesType, FormOwnPropsType> & FormOwnPropsType> = (props) => {
    return <form onSubmit={props.handleSubmit}>
        {createField<SettingsFormKeysType>('Email', 'email', Input, [required], {type: 'text'})}
        {createField<SettingsFormKeysType>('Fide rating', 'rating', Input, [], {type: 'number'})}
        {props.pristine && props.wasSaved && <div className={s.saved}>Successfully saved</div>}
        <button>Save</button>
    </form>
};

const SettingsFormRedux = reduxForm<SettingsFormValuesType, FormOwnPropsType>({ form: 'settings', enableReinitialize: true })(SettingsForm);

const mapStateToProps = (state: AppStateType) => ({
    email: state.profile.email,
    rating: state.profile.rating,
    wasSaved: state.profile.wasSaved,
});

export default withAuthRedirect(connect<MapPropsType, DispatchPropsType, {}, AppStateType>(
    mapStateToProps, { getUserProfile, saveSettings, setProfileSaved: actions.setProfileSaved })(SettingsPage));

type SettingsFormValuesType = {
    email: string | null,
    rating: number | null,
};
type SettingsFormKeysType = getStringKeys<SettingsFormValuesType>;
type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    getUserProfile: () => void,
    saveSettings: (email: string, rating: number | null) => void,
    setProfileSaved: (saved: boolean) => void,
};
type FormOwnPropsType = {
    wasSaved: boolean,
};
type PropsType = MapPropsType & DispatchPropsType;