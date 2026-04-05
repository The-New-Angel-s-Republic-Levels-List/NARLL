import { fetchCreators } from '../content.js';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },

    data: () => ({
        creators: [],
        loading: true,
        selected: 0,
        err: null
    }),

    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">

                <p v-if="err" class="error">{{ err }}</p>

                <!-- LEFT LIST -->
                <div class="board-container">
                    <table class="board">
                        <tr 
                            v-for="(c, i) in creators"
                            :class="{
                                'top-1': i === 0,
                                'top-2': i === 1,
                                'top-3': i === 2
                            }"
                        >
                            <td class="rank">
                                <p>#{{ i + 1 }}</p>
                            </td>

                            <td class="points">
                                <p>{{ c.points }}</p>
                            </td>

                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ c.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- RIGHT PANEL -->
                <div class="player-container">
                    <div class="player" v-if="creator">
                        <h1>#{{ selected + 1 }} {{ creator.user }}</h1>
                        <h3>{{ creator.points }} points</h3>

                        <h2>Best Awarded Level</h2>
                        <p>{{ creator.best }}</p>

                        <h2>Featured Levels ({{ creator.featured.length }})</h2>
                        <table class="table">
                            <tr v-for="lvl in creator.featured">
                                <td>
                                    <p>{{ lvl }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    `,

    computed: {
        creator() {
            return this.creators[this.selected];
        }
    },

    async mounted() {
        const creators = await fetchCreators();

        if (!creators) {
            this.err = "Failed to load creators.";
        } else {
            this.creators = creators.sort((a, b) => b.points - a.points);
        }

        this.loading = false;
    }
};