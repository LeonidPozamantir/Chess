import React from 'react';
import s from './GameStatus.module.css';
import { connect } from 'react-redux';
import { AppStateType } from '../../../redux/store';
import { GameStatusEnum, requestStartGame, offerDraw, acceptDraw, declineDraw, resign } from '../../../redux/gameReducer';
import Preloader from '../../common/Preloader/Preloader';

const GameStatus: React.FC<PropsType> = (props) => {
    const movesList = props.moves.map((m, idx) => {
        return <div className={s.moveLine}>
            <div className={s.whiteMove}>{idx + 1}. {m.w ? m.w.notation : '...'}</div>
            <div className={s.blackMove}>{m.b ? m.b.notation : ''}</div>
        </div>
    });

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
                    {movesList}
                </div>
                {props.opponentOfferedDraw &&
                    <div className={s.offerDrawBlock}>
                        <div className={s.drawRow}>Your opponent has offered draw</div>
                        <div className={s.drawRow}>
                            <button onClick={props.acceptDraw}>Accept</button>
                            <button onClick={props.declineDraw}>Decline</button>
                        </div>
                    </div>
                }
                <div className={s.gameButtons}>
                    <button onClick={props.offerDraw} disabled={props.wasDrawOffered || props.opponentOfferedDraw}>Offer draw</button>
                    <button onClick={props.resign}>Resign</button>
                </div>
            </div>
        }
        
    </div>;
};

const mapStateToProps = (state: AppStateType) => ({
    gameStatus: state.game.gameStatus,
    isWaitingForGameStart: state.game.isWaitingForGameStart,
    wasDrawOffered: state.game.wasDrawOffered,
    opponentOfferedDraw: state.game.opponentOfferedDraw,
    moves: state.game.moves,
});

export default connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, { startGame: requestStartGame, offerDraw, acceptDraw, declineDraw, resign })(GameStatus);

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    startGame: () => void,
    offerDraw: () => void,
    acceptDraw: () => void,
    declineDraw: () => void,
    resign: () => void,
};
type PropsType = MapPropsType & DispatchPropsType;