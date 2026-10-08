import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/flight.css';
import './styles/board.css';
import './styles/sections.css';

import { initBoard } from './board.js';
import { initForm } from './form.js';

document.documentElement.classList.add('js');

initBoard();
initForm();
