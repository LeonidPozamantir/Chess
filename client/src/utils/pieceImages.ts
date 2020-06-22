import wp from '../assets/pieces/wp.png';
import wn from '../assets/pieces/wn.png';
import wb from '../assets/pieces/wb.png';
import wr from '../assets/pieces/wr.png';
import wq from '../assets/pieces/wq.png';
import wk from '../assets/pieces/wk.png';
import bp from '../assets/pieces/bp.png';
import bn from '../assets/pieces/bn.png';
import bb from '../assets/pieces/bb.png';
import br from '../assets/pieces/br.png';
import bq from '../assets/pieces/bq.png';
import bk from '../assets/pieces/bk.png';
import { getStringKeys } from '../components/common/FormControls/FormControls';

export const pieceImages = {
    wp, wn, wb, wr, wq, wk, bp, bn, bb, br, bq, bk,
};

export type PieceTypeType = getStringKeys<typeof pieceImages>;