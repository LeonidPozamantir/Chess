// @ts-nocheck
import { getStringKeys } from "../components/common/FormControls/FormControls";
import { PiecesListType, MoveType, Color, PromotionPieceType } from "../redux/gameReducer";
import { PieceType } from "./pieceImages";

class ChessPosition {
    piecesList: PiecesListType
    sideToMove: Color
    moveNumber: 1
    canWCS: boolean // can white castle short
    canWCL: boolean
    canBCS: boolean
    canBCL: boolean
    enPassant: {x: number, y: number} | null
    promotionChoice: MoveType | null // pawn promotion field when user has to choose promotion piece

    constructor() {
        this.piecesList = [];
        this.sideToMove = 'w';
        this.moveNumber = 1;
        this.canWCS = true;
        this.canWCL = true;
        this.canBCS = true;
        this.canBCL = true;
        this.enPassant = null;
        this.promotionChoice = null;
    }

    copy(position?: ChessPosition): ChessPosition {}
    setPiecesList(isDefault: boolean, piecesList?: PiecesListType) {}
    makeMove(move: MoveType): ChessPosition {}
    choosePromotion(pt: PromotionPieceType): ChessPosition {}
    isMoveLegal(move: MoveType): boolean
    isCheckmate(): boolean
    isStalemate(): boolean
    getMoveNotation(move: MoveType): string
};

export const classUpdate = (NewClass: typeof ChessPosition) => {
    // type kt = getStringKeys<typeof ChessPosition.prototype>;
    type kt = keyof typeof ChessPosition.prototype;
    Object.getOwnPropertyNames(NewClass.prototype).forEach(k => {
        // @ts-ignore
        ChessPosition.prototype[k as kt] = NewClass.prototype[k as kt];
    });
};

export default ChessPosition;