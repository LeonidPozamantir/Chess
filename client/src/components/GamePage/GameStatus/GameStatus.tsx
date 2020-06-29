import React from 'react';
import s from './GameStatus.module.css';
import { connect } from 'react-redux';
import { AppStateType } from '../../../redux/store';
import { GameStatusEnum, startGame } from '../../../redux/gameReducer';

const GameStatus: React.FC<PropsType> = (props) => {
    if (props.gameStatus === GameStatusEnum.NotStarted) {
        return <div className={`${s.gameStatus}`}>
            <button onClick={props.startGame}>Start game</button>
        </div>
    }
    return <div className={`${s.gameStatus} ${s.movesList}`}>
        
    </div>;
};

const mapStateToProps = (state: AppStateType) => ({
    gameStatus: state.game.gameStatus,
});

export default connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, { startGame })(GameStatus);

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    startGame: () => void,
};
type PropsType = MapPropsType & DispatchPropsType;