import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Unverified from './pages/Impossible.js';
import Packs from './pages/Packs.js';
import Unverified from './pages/Unverified.js';

export default [
    { path: '/', component: List },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
    { path: '/packs', component: Packs },
    { path: '/impossible', component: Impossible },
    { path: '/unverified', component: Unverified },
];