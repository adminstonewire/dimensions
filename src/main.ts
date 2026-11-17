import './styles.css';
import { setPlaying, show } from './app/app';
import { findExperience, parseState, toSearch, type State } from './app/url';
import { experiences } from './scenes';
import { mountUI } from './ui/bar';

const go = (s: State) => {
  history.replaceState(null, '', toSearch(s));
  show(findExperience(experiences, s), s.v);
};

const initial = parseState(location.search, experiences);
mountUI(experiences, initial, go, setPlaying);
go(initial);
