import React, { useState, ChangeEvent, useEffect, createRef } from 'react';
import path from 'path';

import defaultPic from '../../assets/images/user.png';
import s from './SettingsPage.module.css';
import Preloader from '../common/Preloader/Preloader';

const ProfilePicture: React.FC<PropsType> = (props) => {

    const [pictureLink, setPictureLink] = useState(null as string | null);
    const [pictureFile, setPictureFile] = useState(null as File | null);
    const [wasPictureChanged, setWasPictureChanged] = useState(false);
    const [isPictureJustSaved, setIsPictureJustSaved] = useState(false);
    const [isPictureSaving, setIsPictureSaving] = useState(false);

    const fileInputRef = createRef<HTMLInputElement>();

    useEffect(() => {
        if (fileInputRef.current) fileInputRef.current.value='';
        setPictureLink(null);
        setPictureFile(null);
        setWasPictureChanged(false);
        setIsPictureJustSaved(true);
        setIsPictureSaving(false);
    }, [props.profilePicture]);

    useEffect(() => {
        setIsPictureSaving(false);
    }, [props.errorMessageSavingPicture]);

    useEffect(() => {
        setIsPictureJustSaved(false);
        props.setErrorSavingPicture(null);
    }, []);

    const handleChoosePicture = (e: ChangeEvent<HTMLInputElement>) => {
        if (pictureLink) URL.revokeObjectURL(pictureLink);
        if (e.target.files && e.target.files.length) {
            setPictureLink(URL.createObjectURL(e.target.files[0]));
            setPictureFile(e.target.files[0]);
            setWasPictureChanged(true);
            setIsPictureJustSaved(false);
            props.setErrorSavingPicture(null);
        }
    };

    const handleSavePicture = () => {
        if (pictureFile) {
            const ext = path.extname(pictureFile.name);
            if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                props.setErrorSavingPicture('Wrong file extension - only jpg, jpeg and png formats are accepted');
                return;
            }
        }
        setIsPictureSaving(true);
        props.setErrorSavingPicture(null);
        props.saveProfilePicture(pictureFile as File);
    };

    return <div className={s.settingsBlock}>
        <img src={pictureLink || props.profilePicture || defaultPic} style={{maxWidth: '300px', maxHeight: '300px'}}/>
        <div><input type='file' ref={fileInputRef} onChange={handleChoosePicture} /></div>
        <div><button onClick={handleSavePicture} disabled={!wasPictureChanged || isPictureSaving}>Save</button></div>
        {isPictureSaving && <div className={s.preloader}><Preloader /></div>}
        {isPictureJustSaved && <div className={s.saved}>Successfully saved</div>}
        {props.errorMessageSavingPicture && <div className={s.error}>{props.errorMessageSavingPicture}</div>}
    </div>;
};

export default ProfilePicture;

type PropsType = {
    profilePicture: string | null,
    errorMessageSavingPicture: string | null,
    saveProfilePicture: (file: File) => void,
    setErrorSavingPicture: (isErrorSavingPicture: string | null) => void,
};