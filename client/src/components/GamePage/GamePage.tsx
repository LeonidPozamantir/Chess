import React from 'react';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';

const GamePage = () => {
    return <div>
        Game will be here
    </div>;
};

export default withAuthRedirect(GamePage);