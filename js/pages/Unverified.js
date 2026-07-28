import { store } from "../main.js";
import { embed } from "../util.js";
import { fetchUnverifiedList } from "../content.js";

import Spinner from "../components/Spinner.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

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
                            :class="[
                                { 
                                    'active': store.selected == originalIndex,
                                    'error': !level
                                },
                                {
                                    'level-top': level?.featured === 'top',
                                    'level-highlight': level?.featured === 'highlight',
                                    'level-featured': level?.featured === 'featured',
                                    'level-angel-default': level?.featured === 'award'
                                }
                            ]"
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

                    <div class="tags" v-if="level.tags">
                        <div class="type-title-sm">Tags</div>
                        <p>{{ level.tags }}</p>
                    </div>

                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">Author</div>
                            <p>{{ level.creators?.join(", ") }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">Verifier</div>
                            <p>{{ level.verifier }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">Progress</div>
                            <p>{{ level.progress }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">Length</div>
                            <p>{{ level.length }}</p>
                        </li>
                    </ul>

                    <iframe
                        v-if="video"
                        class="video"
                        id="videoframe"
                        :src="video"
                        frameborder="0">
                    </iframe>

                    <p>
                        Notes: {{ level.notes || "None" }}
                    </p>

                    <p v-if="level.wr_holder">
                        WR Holder: {{ level.wr_holder }}
                    </p>

                    <p v-if="level.nong">
                        NONG: {{ level.nong }}
                    </p>

                </div>

                <div v-else-if="store.selected == null" class="level center">
                    <h2>Unverified Levels</h2>
                    <p>The following levels on the left are unverified and thus cannot be on the list.</p>
                    <p>
                        Keep in mind, a lot of the levels may not be list worthy 
                        (i.e not on par with the current standards) as they were created a long time ago.
                        Please confirm with a moderator before attempting to verify one.
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
        store,
        roleIconMap
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
        },

        video() {
            if (!this.level || this.level.showcase === "NA") {
                return null;
            }

            return embed(this.level.showcase);
        }
    },

    async mounted() {
        store.selected = null;
        
        try {
            this.list = await fetchUnverifiedList();

            if (!this.list) {
                this.errors.push("Failed to load unverified list.");
            } else {
                this.errors.push(
                    ...this.list
                        .filter(([_, err]) => err)
                        .map(([_, err]) => `Failed to load level (${err}.json)`)
                );
            }
        } catch (e) {
            console.error(e);
            this.errors.push("Unexpected error while loading page.");
        }

        this.loading = false;
    },

    watch: {
        search() {
            store.selected = null;
        }
    }
};