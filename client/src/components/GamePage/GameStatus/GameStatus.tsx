import React from 'react';
import s from './GameStatus.module.css';
import { connect } from 'react-redux';
import { AppStateType } from '../../../redux/store';
import { GameStatusEnum, requestStartGame } from '../../../redux/gameReducer';
import Preloader from '../../common/Preloader/Preloader';

const GameStatus: React.FC<PropsType> = (props) => {
    return <div className={`${s.gameStatus}`}>
        {props.gameStatus !== GameStatusEnum.InProgress && 
            <div className={s.gameStartBlock}>
                {!props.isWaitingForGameStart && <button onClick={props.startGame}>Start game</button>}
                {props.isWaitingForGameStart && 'Waiting for opponent...'}
            </div>
        }
        {props.isWaitingForGameStart && 
            <div className={s.waitingBlock}>
                <Preloader />
            </div>
        }
        {props.gameStatus === GameStatusEnum.InProgress && 
            <div className={s.gameStatusContent}>
                <div className={s.movesList}>
                </div>
                <div className={s.gameButtons}>
                    <button>Offer draw</button>
                    <button>Resign</button>
                </div>
            </div>
        }
        
    </div>;
};

const mapStateToProps = (state: AppStateType) => ({
    gameStatus: state.game.gameStatus,
    isWaitingForGameStart: state.game.isWaitingForGameStart
});

export default connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, { startGame: requestStartGame })(GameStatus);

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    startGame: () => void,
};
type PropsType = MapPropsType & DispatchPropsType;