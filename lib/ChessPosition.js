class ChessPosition {
    constructor() {
        this.piecesList = [];
        this.sideToMove = 'w';
        this.moveNumber = 1;
        this.canWCS = true;
        this.canWCL = true;
        this.canBCS = true;
        this.canBCL = true;
        this.enPassant = null;
    }

    copy() {
        let cp = new ChessPosition();
        cp.piecesList = this.piecesList.map(p => ({...p}));
        cp.sideToMove = this.sideToMove;
        cp.moveNumber = this.moveNumber;
        cp.canWCS = this.canWCS;
        cp.canWCL = this.canWCL;
        cp.canBCS = this.canBCS;
        cp.canBCL = this.canBCL;
        cp.enPassant = this.enPassant;
        return cp;
    }

    setPiecesList(isDefault, piecesList) {
        this.piecesList = isDefault 
            ? [
                {type: 'wr', x: 1, y: 1},
                {type: 'wn', x: 2, y: 1},
                {type: 'wb', x: 3, y: 1},
                {type: 'wq', x: 4, y: 1},
                {type: 'wk', x: 5, y: 1},
                {type: 'wb', x: 6, y: 1},
                {type: 'wn', x: 7, y: 1},
                {type: 'wr', x: 8, y: 1},
                {type: 'wp', x: 1, y: 2},
                {type: 'wp', x: 2, y: 2},
                {type: 'wp', x: 3, y: 2},
                {type: 'wp', x: 4, y: 2},
                {type: 'wp', x: 5, y: 2},
                {type: 'wp', x: 6, y: 2},
                {type: 'wp', x: 7, y: 2},
                {type: 'wp', x: 8, y: 2},
                {type: 'br', x: 1, y: 8},
                {type: 'bn', x: 2, y: 8},
                {type: 'bb', x: 3, y: 8},
                {type: 'bq', x: 4, y: 8},
                {type: 'bk', x: 5, y: 8},
                {type: 'bb', x: 6, y: 8},
                {type: 'bn', x: 7, y: 8},
                {type: 'br', x: 8, y: 8},
                {type: 'bp', x: 1, y: 7},
                {type: 'bp', x: 2, y: 7},
                {type: 'bp', x: 3, y: 7},
                {type: 'bp', x: 4, y: 7},
                {type: 'bp', x: 5, y: 7},
                {type: 'bp', x: 6, y: 7},
                {type: 'bp', x: 7, y: 7},
                {type: 'bp', x: 8, y: 7},
            ]
            : piecesList;
    }

    makeMove(move) {
        if (!this.isMoveLegal(move)) return this;
        let cp = this.copy();
        let piece = this.board[move.fromX][move.fromY];
        let pieceType = this.getPieceType(piece);
        cp.movePiece(move);
        
        // castling
        cp.canWCS = cp.canWCS && !(move.fromX === 8 && move.fromY === 1 || move.toX === 8 && move.toY === 1 || move.fromX === 5 && move.fromY === 1);
        cp.canWCL = cp.canWCL && !(move.fromX === 1 && move.fromY === 1 || move.toX === 1 && move.toY === 1 || move.fromX === 5 && move.fromY === 1);
        cp.canBCS = cp.canBCS && !(move.fromX === 8 && move.fromY === 8 || move.toX === 8 && move.toY === 8 || move.fromX === 5 && move.fromY === 8);
        cp.canBCL = cp.canBCL && !(move.fromX === 1 && move.fromY === 8 || move.toX === 1 && move.toY === 8 || move.fromX === 5 && move.fromY === 8);
        
        cp.enPassant = (pieceType === 'p' && Math.abs(move.fromY - move.toY) === 2) ? {x: move.fromX, y: (move.fromY + move.toY) / 2} : null;
        
        // pawn promotion
        if (pieceType === 'p' && (move.toY === 8 || move.toY === 1)) {
            cp.promotionChoice = {x: move.toX, y: move.toY};
            return cp;
        }

        if (cp.sideToMove === 'b') {
            cp.sideToMove = 'w';
            cp.moveNumber++;
        } else cp.sideToMove = 'b';   

        cp.buildLegalMoves();
        return cp;
        
    }

    movePiece(move) {
        this.piecesList = this.piecesList.filter(p => {
            if (p.x === move.toX && p.y === move.toY) return false;
            let pieceType = this.getPieceType(p.type);
            if (this.enPassant && move.toX === this.enPassant.x && move.toY === this.enPassant.y
                && pieceType === 'p' && p.x === this.enPassant.x && Math.abs(p.y - this.enPassant.y) === 1) return false;
            return true;
        });
        this.piecesList.forEach(p => {
            if (p.x === move.fromX && p.y === move.fromY) {
                if (this.getPieceType(p.type) === 'k' && Math.abs(p.x - move.toX) === 2) {
                    let rookX = move.toX - p.x === 2 ? 8 : 1;
                    this.piecesList.forEach(p2 => {
                        if (p2.x === rookX && p2.y === p.y) {
                            p2.x = rookX === 8 ? 6 : 4;
                        }
                    });
                }
                p.x = move.toX;
                p.y = move.toY;
            }
        });
    }

    // actually start in the point where makeMove finished action in case of promotion
    choosePromotion(pt) {
        let cp = this.copy();
        cp.piecesList.forEach(p => {
            if (p.x === this.promotionChoice.x && p.y === this.promotionChoice.y) {
                p.type = this.getPieceColor(p.type) + pt;
            }
        });

        if (cp.sideToMove === 'b') {
            cp.sideToMove = 'w';
            cp.moveNumber++;
        } else cp.sideToMove = 'b';   

        cp.buildLegalMoves();
        return cp;
    }

    isMoveLegal(move) {
        const legalMoves = this.getLegalMoves();
        return legalMoves.some(lm => lm.fromX === move.fromX && lm.fromY === move.fromY && lm.toX === move.toX && lm.toY === move.toY);
    }

    getLegalMoves() {
        if (!this.legalMoves) this.buildLegalMoves();
        return this.legalMoves;
    }

    buildLegalMoves() {
        if (this.legalMoves) return;
        if (!this.board) this.buildBoard();
        let potentialMoves = this.getPotentialMoves();
        this.legalMoves = potentialMoves.filter(move => {
            let cp = this.copy();
            cp.movePiece(move);
            return !cp.isChecked();
        });
    }

    getPotentialMoves(attackedFieldsOnly = false) {
        let potentialMoves = [];
        if (!this.board) this.buildBoard();
        this.piecesList.forEach(p => {
            let pieceColor = this.getPieceColor(p.type);
            let pieceType = this.getPieceType(p.type);
            if (pieceColor !== this.sideToMove) return;
            let vectors = [];
            switch(pieceType) {
                case 'p':
                    let [base, vector] = pieceColor === 'w' ? [2, 1] : [7, -1];
                    let fieldInFront = this.board[p.x][p.y + vector];
                    if (fieldInFront === null && !attackedFieldsOnly) {
                        potentialMoves.push({ fromX: p.x, fromY: p.y, toX: p.x, toY: p.y + vector });
                        if (p.y === base && this.board[p.x][p.y + vector * 2] === null) potentialMoves.push({ fromX: p.x, fromY: p.y, toX: p.x, toY: p.y + vector * 2 });
                    }
                    if (p.x > 1) {
                        let p2 = this.board[p.x - 1][p.y + vector];
                        if (p2 && this.getPieceColor(p2) !== pieceColor) potentialMoves.push({ fromX: p.x, fromY: p.y, toX: p.x - 1, toY: p.y + vector });
                    }
                    if (p.x < 8) {
                        let p2 = this.board[p.x + 1][p.y + vector];
                        if (p2 && this.getPieceColor(p2) !== pieceColor) potentialMoves.push({ fromX: p.x, fromY: p.y, toX: p.x + 1, toY: p.y + vector });
                    }
                    if (this.enPassant && Math.abs(this.enPassant.x - p.x) === 1 && this.enPassant.y === p.y + vector) {
                        potentialMoves.push({ fromX: p.x, fromY: p.y, toX: this.enPassant.x, toY: p.y + vector });
                    }
                    break;
                case 'n':
                case 'k':
                    vectors = pieceType === 'n'
                        ? [{x: 2, y: 1}, {x: 2, y: -1}, {x: -2, y: 1}, {x: -2, y: -1}, {x: 1, y: 2}, {x: 1, y: -2}, {x: -1, y: 2}, {x: -1, y: -2}]
                        : [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}];
                    vectors.forEach(v => {
                        let toX = p.x + v.x;
                        let toY = p.y + v.y;
                        if (toX <= 8 && toX >= 1 && toY <= 8 && toY >= 1 && (!this.board[toX][toY] || this.getPieceColor(this.board[toX][toY]) !== pieceColor)) {
                            potentialMoves.push({ fromX: p.x, fromY: p.y, toX, toY });
                        }
                    });
                    if (pieceType === 'k' && !attackedFieldsOnly) {
                        if (pieceColor === 'w') {
                            if (this.canWCS && !this.board[6][1] && !this.board[7][1] && !this.isChecked() && !this.isFieldAttacked(6, 1) && !this.isFieldAttacked(7, 1)) {
                                potentialMoves.push({ fromX: p.x, fromY: p.y, toX: p.x + 2, toY: p.y });
                            }
                            if (this.canWCL && !this.board[4][1] && !this.board[3][1] && !this.isChecked() && !this.isFieldAttacked(4, 1) && !this.isFieldAttacked(3, 1)) {
                                potentialMoves.push({ fromX: p.x, fromY: p.y, toX: p.x - 2, toY: p.y });
                            }
                        }
                        if (pieceColor === 'b') {
                            if (this.canBCS && !this.board[6][8] && !this.board[7][8] && !this.isChecked() && !this.isFieldAttacked(6, 8) && !this.isFieldAttacked(7, 8)) {
                                potentialMoves.push({ fromX: p.x, fromY: p.y, toX: p.x + 2, toY: p.y });
                            }
                            if (this.canBCL && !this.board[4][8] && !this.board[3][8] && !this.isChecked() && !this.isFieldAttacked(4, 8) && !this.isFieldAttacked(3, 8)) {
                                potentialMoves.push({ fromX: p.x, fromY: p.y, toX: p.x - 2, toY: p.y });
                            }
                        }
                    }
                    break;
                case 'b':
                case 'r':
                case 'q':
                    vectors = pieceType === 'b' 
                        ? [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}]
                        : pieceType === 'r'
                            ? [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}]
                            : [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}];
                    vectors.forEach(v => {
                        let considerNextField = true;
                        let toX = p.x;
                        let toY = p.y;
                        while (considerNextField) {
                            toX += v.x;
                            toY += v.y;
                            if (toX < 1 || toX > 8 || toY < 1 || toY > 8 || (this.board[toX][toY] && this.getPieceColor(this.board[toX][toY]) === pieceColor)) {
                                considerNextField = false;
                                break;
                            }
                            if (this.board[toX][toY]) considerNextField = false;
                            potentialMoves.push({ fromX: p.x, fromY: p.y, toX, toY });
                        }
                    });
            }
        });

        return potentialMoves;
    }

    buildBoard() {
        if (this.board) return;
        this.board = [null,[],[],[],[],[],[],[],[]];
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                this.board[i][j] = null;
            }
        }
        this.piecesList.forEach(p => {
            this.board[p.x][p.y] = p.type;
        });
    }

    getPieceColor(pieceType) {
        return pieceType.substring(0, 1);
    }
    getPieceType(pieceType) {
        return pieceType.substring(1, 2);
    }

    isFieldAttacked(x, y) {
        if (!this.attackedFields) this.calculateAttackedFields();
        return this.attackedFields.some(field => field.x === x && field.y === y);
    }

    calculateAttackedFields() {
        if (this.attackedFields) return;
        this.attackedFields = [];
        let cp = this.copy();
        cp.sideToMove = cp.sideToMove === 'w' ? 'b' : 'w';
        let pm = cp.getPotentialMoves(true);
        pm.forEach(move => {
            this.attackedFields.push({x: move.toX, y: move.toY});
        });
    }

    isChecked() {
        for (let i = 0; i < this.piecesList.length; i++) {
            let p  = this.piecesList[i];
            if (this.getPieceColor(p.type) === this.sideToMove && this.getPieceType(p.type) === 'k') {
                return this.isFieldAttacked(p.x, p.y);
            }
        }
    }

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessPosition;
} else {
    this.ChessPosition = ChessPosition;
}