import React from 'react';
import s from './PlayerHeader.module.css';

const PlayerHeader: React.FC<PropsType> = (props) => {
    let time;
    if (props.remTime === null) time = null;
    else {
        let secs = Math.ceil(props.remTime / 1000);
        let mins = Math.floor(secs / 60);
        secs = secs % 60;
        let hours = Math.floor(mins / 60);
        mins = mins % 60;
        time = `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return <div className={`${s.playerHeader} ${props.turn ? s.turn : ''}`}>
        <img src={props.profilePicture || ''} />
        {props.name} {props.rating && `(${props.rating})`}
        <div className={s.clock}>{time}</div>
    </div>;
};

export default PlayerHeader;

type PropsType = {
    name: string,
    rating: number,
    turn: boolean,
    remTime: number | null,
    profilePicture: string | null,
};