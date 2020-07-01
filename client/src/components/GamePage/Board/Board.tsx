import React from 'react';
import s from './Board.module.css';
import { pieceImages, PieceType } from '../../../utils/pieceImages';
import { PositionType, PiecePositionType, MoveType, PiecesListType, PromotionPieceType, GameStatusEnum, GameResultEnum, Color } from '../../../redux/gameReducer';
import PromotionChoice from './PromotionChoice';
import GameComplete from './GameComplete';

class Board extends React.Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = {
            selectedCell: null,
        };
    }

    handleCellClick(x: number, y: number) {
        const sc = this.state.selectedCell;
        if (sc) {
            this.props.makeMove({fromX: sc.x, fromY: sc.y, toX: x, toY: y});
            this.setState({ selectedCell: null });
        }
    }

    handlePieceClick(p: PiecePositionType) {
        if (this.props.isPromotion) return;
        if (this.props.gameStatus !== GameStatusEnum.InProgress) return;
        if (this.state.selectedCell) {
            this.handleCellClick(p.x, p.y);
            return;
        }

        if (this.props.playerColor !== this.props.sideToMove) return;
        if (this.getPieceColor(p.type) !== this.props.sideToMove) return;
        else this.setState({ selectedCell: {x: p.x, y: p.y} });
    }

    render() {
        function calcLeft(x: number, color: Color) {
            return color === 'w' ? (x - 1) * 12.5 + '%' : (8 - x) * 12.5 + '%';
        }

        function calcTop(y: number, color: Color) {
            return color === 'w' ? (8 - y) * 12.5 + '%' : (y - 1) * 12.5 + '%';
        }
        const { piecesList, sideToMove, isPromotion, choosePromotion, gameStatus, gameResult, playerColor } = this.props;
        const r8_1 = [8, 7, 6, 5, 4, 3, 2, 1];
        const c1_8 = [1, 2, 3, 4, 5, 6, 7, 8];
        const rows = r8_1.map(rowNum => {
            let top = calcTop(rowNum, playerColor);
            return c1_8.map(colNum => {
                let left = calcLeft(colNum, playerColor);
                let sc = this.state.selectedCell;
                let isSelected = sc && sc.x === colNum && sc.y === rowNum ? s.selected : '';
                let color = (colNum + rowNum) % 2 === 0 ? 'black' : 'white';
                return <div key={`${colNum}${rowNum}`} className={`${s.cell} ${s[color]} ${isSelected}`} style={{left, top}} onClick={() => this.handleCellClick(colNum, rowNum)}></div>;
            });
        });
        const pieces = piecesList.map((p, idx) => {
            return <img className={s.piece} key={idx} src={pieceImages[p.type]} onClick={() => this.handlePieceClick(p)} style={{left: calcLeft(p.x, playerColor), top: calcTop(p.y, playerColor)}} />
        });
        return <div className={s.board}>
            {rows}
            {pieces}
            {isPromotion && <PromotionChoice color={sideToMove} choosePromotion={choosePromotion} />}
            {gameStatus === GameStatusEnum.Finished && <GameComplete gameResult={gameResult} />}
        </div>;
    }

    getPieceColor(pt: PieceType): Color {
        return pt.substring(0, 1) as Color;
    }
    
};

export default Board;

type PropsType = {
    piecesList: PiecesListType,
    sideToMove: Color,
    isPromotion: boolean,
    gameStatus: GameStatusEnum,
    gameResult: GameResultEnum,
    playerColor: Color,
    makeMove: (move: MoveType) => void,
    choosePromotion: (pt: PromotionPieceType) => void,
};
type StateType = {
    selectedCell: {x: number, y: number} | null,
};