import React from 'react';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import s from './GamePage.module.css';
import PlayerHeader from './PlayerHeader/PlayerHeader';
import GameStatus from './GameStatus/GameStatus';
import Board from './Board/Board';
import { connect } from 'react-redux';
import { AppStateType } from '../../redux/store';
import { gameActions } from '../../redux/gameReducer';

const GamePage: React.FC<PropsType> = ({ position, makeMove }) => {
    debugger;
    // @ts-ignore
    window.functions.sayHello();
    return <div className={s.externalContainer}>
        <div className={s.extendedBoard}>
            <PlayerHeader />
            <Board position={position} makeMove={makeMove}/>
            <PlayerHeader />
        </div>
        <GameStatus />
    </div>;
};

const mapStateToProps = (state: AppStateType) => ({
    position: state.game.position,
});

export default withAuthRedirect(connect<MapPropsType, DispatchPropsType, {}, AppStateType>(mapStateToProps, {makeMove: gameActions.makeMove})(GamePage));

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    makeMove: (fromX: number, fromY: number, toX: number, toY: number) => void,
}
type PropsType = MapPropsType & DispatchPropsType;