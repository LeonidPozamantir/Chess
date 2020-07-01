import React from 'react';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import s from './GamePage.module.css';
import PlayerHeader from './PlayerHeader/PlayerHeader';
import GameStatus from './GameStatus/GameStatus';
import Board from './Board/Board';
import { connect } from 'react-redux';
import { AppStateType } from '../../redux/store';
import { gameActions, MoveType, PromotionPieceType, sendMove, choosePromotion } from '../../redux/gameReducer';

class GamePage extends React.Component<PropsType> {

    render() {
        const { piecesList, sideToMove, isPromotion, makeMove, choosePromotion, gameStatus, gameResult, playerColor } = this.props;
        return <div className={s.externalContainer}>
            <div className={s.extendedBoard}>
                <PlayerHeader />
                <Board piecesList={piecesList} makeMove={makeMove} sideToMove={sideToMove} 
                    isPromotion={isPromotion} choosePromotion={choosePromotion} gameStatus={gameStatus} gameResult={gameResult}
                    playerColor={playerColor} />
                <PlayerHeader />
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
});

export default withAuthRedirect(connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, {
    makeMove: sendMove,
    setDefaultPosition: gameActions.setDefaultPosition,
    choosePromotion: choosePromotion,
})(GamePage));

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    makeMove: (move: MoveType) => void,
    setDefaultPosition: () => void,
    choosePromotion: (pt: PromotionPieceType) => void,
}
type PropsType = MapPropsType & DispatchPropsType;