import * as React from 'react';
import * as ViewModel from './GameViewModel';

interface Props {
    gameState : ViewModel.GameState;
}

export class GameUI extends React.Component<Props> {
    render() {
    	let players = this.props.gameState.players.map(p => <li key={p.name}>{p.name}</li>);

        return (
        	<div>
        		<h3>Players:</h3>
            	<ul>{players}</ul>
            </div>
        )
    }
}