import React from 'react';
import s from './Board.module.css';
import { pieceImages } from '../../../utils/pieceImages';
import { PositionType, PieceType } from '../../../redux/gameReducer';

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
            this.props.makeMove(sc.x, sc.y, x, y);
            this.setState({ selectedCell: null });
        }
    }

    handlePieceClick(p: PieceType) {
        if(this.state.selectedCell) this.handleCellClick(p.x, p.y);
        else this.setState({ selectedCell: {x: p.x, y: p.y} });
    }

    render() {
        const {position: {piecesList}} = this.props;
        const r8_1 = [8, 7, 6, 5, 4, 3, 2, 1];
        const c1_8 = [1, 2, 3, 4, 5, 6, 7, 8];
        const rows = r8_1.map(rowNum => {
            let top = (8 - rowNum) * 12.5 + '%';
            return c1_8.map(colNum => {
                let left = (colNum - 1) * 12.5 + '%';
                let sc = this.state.selectedCell;
                let isSelected = sc && sc.x === colNum && sc.y === rowNum ? s.selected : '';
                let color = (colNum + rowNum) % 2 === 0 ? 'black' : 'white';
                return <div className={`${s.cell} ${s[color]} ${isSelected}`} style={{left, top}} onClick={() => this.handleCellClick(colNum, rowNum)}></div>;
            });
        });
        const pieces = piecesList.map(p => {
            return <img className={s.piece} src={pieceImages[p.type]} onClick={() => this.handlePieceClick(p)} style={{left: (p.x - 1) * 12.5 + '%', top: (8 - p.y) * 12.5 + '%'}} />
        });
        return <div className={s.board}>
            {rows}
            {pieces}
        </div>;
    }
    
};

export default Board;

type PropsType = {
    position: PositionType,
    makeMove: (fromX: number, fromY: number, toX: number, toY: number) => void,
};
type StateType = {
    selectedCell: {x: number, y: number} | null,
};