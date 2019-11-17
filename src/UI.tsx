import * as React from 'react';
import * as ViewModel from './GameViewModel';

interface Props {
    gameState : ViewModel.GameState;
}

export class GameUI extends React.Component<Props> {
    render() {
        let toLi = (p : ViewModel.Player) => <li key={p.name}>{p.name}</li>;

        let currentPlayer = toLi(this.props.gameState.currentPlayer);
        let players = this.props.gameState.otherPlayers.map(toLi);

        return (
            <div>
                <h3>Players:</h3>
                <ul>
                    {currentPlayer}
                    {players}
                </ul>
            </div>
        )
    }
}