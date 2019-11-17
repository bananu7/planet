import * as React from 'react';
import { render } from 'react-dom';

import {observable} from "mobx";

import {GameState} from './GameState';
import {Renderer} from './Renderer';

let gameState = new GameState();

render(<Renderer gameState={gameState.viewModel}/>, document.getElementById('main'));