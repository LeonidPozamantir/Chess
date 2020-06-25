import React from 'react';
import { PromotionPieceType, Color } from '../../../redux/gameReducer';
import { pieceImages, PieceType } from '../../../utils/pieceImages';
import s from './PromotionChoice.module.css';

const PromotionChoice: React.FC<PropsType> = (props) => {
    return <div className={s.frame}>
        {(['q', 'r', 'b', 'n'] as Array<PromotionPieceType>).map(p => {
            return <img key={p} className={s.choosePiece} src={pieceImages[props.color + p as PieceType]} onClick={() => props.choosePromotion(p)}/>
        })}
    </div>
};

export default PromotionChoice;

type PropsType = {
    color: Color,
    choosePromotion: (pt: PromotionPieceType) => void,
};