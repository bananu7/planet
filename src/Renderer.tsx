import * as React from 'react';
import * as ViewModel from './GameViewModel';
import {TerrainType, Unit} from './Model';
import {Position, Direction} from "./Position";
import {GameUI} from './UI';

interface TileProps {
    colour: string;
    unit?: Unit;
    onClick: any;
    selected: boolean;
}

class Tile extends React.Component<TileProps> {
    render() {
        let colour = this.props.colour;
        let unit = this.props.unit ? this.props.unit.count : null;

        return (
            <div
                className='tile'
                style={{
                    backgroundColor: colour,
                    opacity: this.props.selected ? "50%" : "100%"
                }}
                onClick={this.props.onClick}
            >
                {unit}
            </div>
        );
    }
}

interface RendererProps {
    gameState : ViewModel.GameState;
}

interface RendererState {
    selectedTile?: Position;
}

export class Renderer extends React.Component<RendererProps, RendererState> {
    handleTileSelect(p: Position) {
        this.setState({
            selectedTile: p
        });
    }

    constructor(props: any) {
        super(props);
        this.state = {selectedTile: undefined};

        this.handleTileSelect = this.handleTileSelect.bind(this);
    }

    render() {
        let board = this.props.gameState.board;

        let tiles = [];
        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.width; y++) {
                let boardTile = board.getTileAt(new Position(x,y));
                let colour = boardTile.terrain == TerrainType.Grass ? "green" : "darkblue"
                let selected : boolean = 
                    this.state
                    && this.state.selectedTile
                    && this.state.selectedTile.x === x
                    && this.state.selectedTile.y === y ? true : false;

                let clickHandler = () => this.handleTileSelect(new Position(x,y));

                tiles.push(<Tile
                    key={x+"_"+y}
                    colour={colour}
                    unit={boardTile.unit}
                    selected={selected}
                    onClick={clickHandler}
                />);
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