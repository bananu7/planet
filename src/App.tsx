import * as React from 'react';
import { render } from 'react-dom';

import {GameState} from './GameState';
import {GameUI} from './UI';

let gameState = new GameState(); 

render(<GameUI gameState={gameState}/>, document.getElementById('main'));