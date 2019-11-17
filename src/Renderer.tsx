import * as React from 'react';
import * as ViewModel from './GameViewModel';
import {Position, Direction} from "./Position";
import {GameUI} from './UI';

interface TileProps {
	colour: string;
	count?: number;
}

class Tile extends React.Component<TileProps> {
	render() {
		let colour = this.props.colour;
		return (
			<div className='tile' style={{backgroundColor: colour}}></div>
		);
	}
}

interface Props {
    gameState : ViewModel.GameState;
}

export class Renderer extends React.Component<Props> {
	render() {
		let board = this.props.gameState.board;

		let tiles = [];
		for (let x = 0; x < board.width; x++) {
			for (let y = 0; y < board.width; y++) {
				let boardTile = board.getTileAt(new Position(x,y));
				let colour = "green";

				tiles.push(<Tile key={x+"_"+y} colour={colour} />);
			}
		}

        return (
        	<div>
        		<GameUI gameState={this.props.gameState} />
            	<div className='board'>{tiles}</div>
            </div>
        );
    }
}