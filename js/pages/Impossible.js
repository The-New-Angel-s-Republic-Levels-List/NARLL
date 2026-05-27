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

                    <h2>World Records</h2>

                    <table class="records">

                        <tr class="record">
                            <td>
                                <div class="type-title-sm">WR from 0%</div>
                                <p>{{ level.wr_0 }}</p>
                            </td>

                            <td>
                                <div class="type-title-sm">Holder</div>
                                <p>{{ level.wr_0_holder }}</p>
                            </td>
                        </tr>

                        <tr class="record">
                            <td>
                                <div class="type-title-sm">WR Run</div>
                                <p>{{ level.wr_run }}</p>
                            </td>

                            <td>
                                <div class="type-title-sm">Holder</div>
                                <p>{{ level.wr_run_holder }}</p>
                            </td>
                        </tr>

                    </table>

                </div>

                <div v-else-if="store.selected == null" class="level center">

                    <h2>Impossible Levels List</h2>

                    <p>
                        The following levels are considered impossible
                        or near-impossible under current human capabilities.
                    </p>

                    <p>
                        Rankings are based on theoretical execution difficulty,
                        precision, consistency, and FPS requirements.
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
            store.selected = 0;
        }
    }
};