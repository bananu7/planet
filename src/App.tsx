import * as React from 'react';
import { render } from 'react-dom';

import {GameState} from './GameState';
import {Renderer} from './Renderer';

let gameState = new GameState(); 

render(<Renderer gameState={gameState.createViewModel()}/>, document.getElementById('main'));