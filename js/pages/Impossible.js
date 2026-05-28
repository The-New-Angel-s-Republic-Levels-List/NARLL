import { store } from "../main.js";
import { fetchImpossibleList } from "../content.js";
import { embed } from "../util.js";

import Spinner from "../components/Spinner.js";

export default {
    components: { Spinner },

    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-list">
            <div class="list-container">

                <div class="search-box">
                    <input 
                        type="text" 
                        v-model="search" 
                        placeholder="Search levels..." 
                        class="search-bar"
                    />
                </div>

                <table class="list" v-if="list">
                    <tr v-for="([level, err, originalIndex], i) in filteredList">
                        <td class="rank">
                            <p class="type-label-lg">#{{ originalIndex + 1 }}</p>
                        </td>

                        <td 
                            class="level"
                            :class="{ 
                                'active': store.selected == originalIndex,
                                'error': !level
                            }"
                        >
                            <button @click="store.selected = originalIndex">
                                <span class="type-label-lg">
                                    {{ level?.name || \`Error (\${err}.json)\` }}
                                </span>
                            </button>
                        </td>
                    </tr>
                </table>

                <p v-if="filteredList.length === 0">
                    No results found.
                </p>
            </div>

            <div class="level-container">

                <div class="level" v-if="level">

                    <h1>{{ level.name }}</h1>

                    <iframe
                        v-if="level.showcase"
                        class="video"
                        :src="embed(level.showcase)"
                        frameborder="0"
                    ></iframe>

                    <ul class="stats">

                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">Creator</div>
                            <p>{{ level.author }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">FPS Required</div>
                            <p>{{ level.fps }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">Botting Enjoyment</div>
                            <p>{{ level.botting_enjoyment }}/10</p>
                        </li>

                    </ul>

                    <h2>Records</h2>

                    <div class="wr-grid">

                        <div class="wr-card">
                            <div class="type-title-sm">WR from 0%</div>
                            <p class="wr-score">{{ level.wr_0 }}</p>

                            <div class="type-title-sm holder-label">Holder</div>
                            <p>{{ level.wr_0_holder }}</p>
                        </div>

                        <div class="wr-card">
                            <div class="type-title-sm">WR Run</div>
                            <p class="wr-score">{{ level.wr_run }}</p>

                            <div class="type-title-sm holder-label">Holder</div>
                            <p>{{ level.wr_run_holder }}</p>
                        </div>

                    </div>

                </div>

                <div v-else-if="store.selected == null" class="level center">

                    <h2>Impossible Levels List</h2>

                    <p>
                        The levels are the left are considered impossible
                        or near impossible under human limits.
                    </p>

                    <p>
                        On the right are the additional rules for submitting levels and records.
                    </p>

                    <p>Select a level to view details.</p>

                </div>

            </div>
        </main>
    `,

    data: () => ({
        list: [],
        loading: true,
        errors: [],
        search: "",
        store
    }),

    computed: {
        level() {
            if (store.selected === null) return null;
            return this.list[store.selected]?.[0];
        },

        filteredList() {
            if (!this.search) {
                return this.list.map((item, i) => [...item, i]);
            }

            const q = this.search.toLowerCase();

            return this.list
                .map((item, i) => [...item, i])
                .filter(([level]) =>
                    level?.name?.toLowerCase().includes(q)
                );
        }
    },

    async mounted() {
        store.selected = null;
        
        try {
            this.list = await fetchImpossibleList();

            if (!this.list) {
                this.errors.push("Failed to load impossible list.");
            } else {
                this.errors.push(
                    ...this.list
                        .filter(([_, err]) => err)
                        .map(([_, err]) =>
                            `Failed to load level (${err}.json)`
                        )
                );
            }
        } catch (e) {
            console.error(e);
            this.errors.push("Unexpected error while loading page.");
        }

        this.loading = false;
    },

    methods: {
        embed
    },

    watch: {
        search() {
            store.selected = null;
        }
    }
};