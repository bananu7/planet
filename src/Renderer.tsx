import * as React from 'react';
import * as ViewModel from './GameViewModel';
import {TerrainType, Unit} from './Model';
import {Position, Direction} from "./Position";
import {GameUI} from './UI';

interface TileProps {
    colour: string;
    unit?: Unit;
}

class Tile extends React.Component<TileProps> {
    render() {
        let colour = this.props.colour;
        let unit = this.props.unit ? this.props.unit.count : null;

        return (
            <div className='tile' style={{backgroundColor: colour}}>
                {unit}
            </div>
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
                let colour = boardTile.terrain == TerrainType.Grass ? "green" : "darkblue"

                tiles.push(<Tile key={x+"_"+y} colour={colour} unit={boardTile.unit} />);
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