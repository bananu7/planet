import * as React from 'react';
import {GameState} from './GameState';

interface Props {
	gameState : GameState;
}

export class GameUI extends React.Component<Props> {
    render() {
        return (
            <div>Your money: {this.props.gameState.players[0].money}</div>
        )
    }
}