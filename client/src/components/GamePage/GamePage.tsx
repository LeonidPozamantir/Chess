import React from 'react';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import s from './GamePage.module.css';
import PlayerHeader from './PlayerHeader/PlayerHeader';
import GameStatus from './GameStatus/GameStatus';
import Board from './Board/Board';
import { connect } from 'react-redux';
import { AppStateType } from '../../redux/store';
import { gameActions, MoveType, PromotionPieceType, makeMove } from '../../redux/gameReducer';

class GamePage extends React.Component<PropsType> {

    render() {
        const { piecesList, sideToMove, isPromotion, makeMove, choosePromotion } = this.props;
        return <div className={s.externalContainer}>
            <div className={s.extendedBoard}>
                <PlayerHeader />
                <Board piecesList={piecesList} makeMove={makeMove} sideToMove={sideToMove} isPromotion={isPromotion} choosePromotion={choosePromotion}/>
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
});

export default withAuthRedirect(connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, {
    makeMove: makeMove,
    setDefaultPosition: gameActions.setDefaultPosition,
    choosePromotion: gameActions.choosePromotion,
})(GamePage));

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    makeMove: (move: MoveType) => void,
    setDefaultPosition: () => void,
    choosePromotion: (pt: PromotionPieceType) => void,
}
type PropsType = MapPropsType & DispatchPropsType;