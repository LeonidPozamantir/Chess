import React from 'react';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import s from './GamePage.module.css';
import PlayerHeader from './PlayerHeader/PlayerHeader';
import GameStatus from './GameStatus/GameStatus';
import Board from './Board/Board';
import { connect } from 'react-redux';
import { AppStateType } from '../../redux/store';
import { gameActions, MoveType, PromotionPieceType, sendMove, choosePromotion, GameStatusEnum, getFullGameState } from '../../redux/gameReducer';

class GamePage extends React.Component<PropsType> {

    componentDidMount() {
        this.props.getFullGameState();
    }

    render() {
        const { piecesList, sideToMove, isPromotion, makeMove, choosePromotion, gameStatus,
            gameResult, playerColor, opponentName, opponentRating, playerName, playerRating, 
            lastMove, whiteRemainingTime, blackRemainingTime } = this.props;
        return <div className={s.externalContainer}>
            <div className={s.extendedBoard}>
                <PlayerHeader name={opponentName} rating={opponentRating} turn={sideToMove !== playerColor && gameStatus === GameStatusEnum.InProgress} 
                    remTime={playerColor === 'w' ? blackRemainingTime : whiteRemainingTime} />
                <Board piecesList={piecesList} makeMove={makeMove} sideToMove={sideToMove} 
                    isPromotion={isPromotion} choosePromotion={choosePromotion} gameStatus={gameStatus} gameResult={gameResult}
                    playerColor={playerColor} lastMove={lastMove} />
                <PlayerHeader name={playerName} rating={playerRating} turn={sideToMove === playerColor && gameStatus === GameStatusEnum.InProgress} 
                    remTime={playerColor === 'b' ? blackRemainingTime : whiteRemainingTime} />
            </div>
            <GameStatus />
        </div>;
    }
    
};

const mapStateToProps = (state: AppStateType) => ({
    piecesList: state.game.position.piecesList,
    sideToMove: state.game.position.sideToMove,
    isPromotion: !!state.game.position.promotionChoice,
    gameStatus: state.game.gameStatus,
    gameResult: state.game.gameResult,
    playerColor: state.game.playerColor,
    opponentName: state.game.opponentName as string,
    opponentRating: state.game.opponentRating as number,
    playerName: state.auth.userName as string,
    playerRating: state.auth.rating as number,
    lastMove: state.game.lastMove,
    whiteRemainingTime: state.game.whiteRemainingTime,
    blackRemainingTime: state.game.blackRemainingTime,
});

export default withAuthRedirect(connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, {
    makeMove: sendMove,
    setDefaultPosition: gameActions.setDefaultPosition,
    choosePromotion,
    getFullGameState
})(GamePage));

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    makeMove: (move: MoveType) => void,
    setDefaultPosition: () => void,
    choosePromotion: (pt: PromotionPieceType) => void,
    getFullGameState: () => void,
}
type PropsType = MapPropsType & DispatchPropsType;