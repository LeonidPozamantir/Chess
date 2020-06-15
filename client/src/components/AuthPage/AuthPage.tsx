// @ts-nocheck
import React from 'react';
import { login } from '../../api/api';

export class AuthPage extends React.Component {

    constructor(props) {
        super(props);
        this.state={mama: null};
    }

    componentDidMount() {
        login()
        .then(data => {
            this.setState(data);
        });
    };

    render() {
        return (
            <div>
                {this.state.mama}
            </div>
        );
    };

};