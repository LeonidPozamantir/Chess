import React from 'react';
import { GameResultEnum } from '../../../redux/gameReducer';
import s from './GameComplete.module.css';

const GameComplete: React.FC<PropsType> = ({ gameResult }) => {
    const gameResultText = ((grCode: GameResultEnum) => {
        switch (grCode) {
            case GameResultEnum.BlackLostByTime: return 'Black lost by time!';
            case GameResultEnum.BlackResigned: return 'Black resigned!';
            case GameResultEnum.BlackWonByCheckmate: return 'Black won by checkmate!';
            case GameResultEnum.DrawAccepted: return 'Draw offer accepted';
            case GameResultEnum.DrawBy50Moves: return 'Draw by 50 moves rule';
            case GameResultEnum.DrawByInsufficientMaterial: return 'Draw by insufficient material';
            case GameResultEnum.DrawByRepetion: return 'Draw by repetition';
            case GameResultEnum.DrawByStalemate: return 'Draw by stalemate';
            case GameResultEnum.NotFinished: return 'Not finished yet';
            case GameResultEnum.WhiteLostByTime: return 'White lost by time!';
            case GameResultEnum.WhiteResigned: return 'White resigned!';
            case GameResultEnum.WhiteWonByCheckmate: return 'White won by checkmate!';
        }
    })(gameResult);
    return <div className={s.frame}>
        {gameResultText}
    </div>;
};

export default GameComplete;

type PropsType = {
    gameResult: GameResultEnum,
};