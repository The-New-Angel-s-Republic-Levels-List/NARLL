import { store } from "../main.js";
import { embed } from "../util.js";
import { fetchUnverifiedList, fetchAwards } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

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
                                { 'active': store.selected == originalIndex, 'error': !level },
                                {
                                'level-top': level?.featured === 'top',
                                'level-highlight': level?.featured === 'highlight',
                                'level-featured': level?.featured === 'featured',
                                'level-angel': level?.featured === 'award'
                                },
                                angelAwardClass(level)
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
                        <p>{{ level.tags || "NA" }}</p>
                    </div>
                    <div class="id-copy">
                      <LevelAuthors :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                      <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    </div>
                    <ul class="stats">
                     <li>
                       <div class="type-title-sm">WR Holder</div>
                       <p>{{ level.wr_holder }}</p>
                    </li>
                    <li>
                        <div class="type-title-sm">Length</div>
                        <p>{{ level.length }}</p>
                    </li>
                        <li v-if="level.nong !== ''">
                        <div class="id-copy nong-icon">
                         <img src="/assets/nong/back.png" class="back">
                         <img src="/assets/nong/front.png" class="front">
                         <span class="tooltip">{{ level.nong }}</span>
                    </div>
                </li>
            </ul>

                    <p>Notes: {{ level.notes }}</p>
            </div>

                <div v-else-if="store.selected == null" class="level center">
                    <h2>Unverified Levels</h2>
                    <p>The following levels on the left are unverified and thus cannot be on the list.</p>
                    <p>
                        Keep in mind, a lot of the levels may not be list worthy (i.e not on par with the current standards) 
                        as they were created a long time ago.
                        Please confirm with a moderator before attempting to verify one.
                    </p>
                    <p>Select a level to view details.</p>
                </div>
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
        roleIconMap,

        awards: []
        
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
      .filter(([level]) => level?.name?.toLowerCase().includes(q));
  },

     video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },

    }

   async mounted() {
        // Hide loading spinner
        this.list = await fetchUnverifiedList()

        this.awards = await fetchAwards();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
        }

        this.loading = false;

        this.$nextTick(() => {
            requestAnimationFrame(() => {
                this.animateCounter();
            });
        });
    },
    methods: {
        embed,
        copyText(text) {
            navigator.clipboard.writeText(text);
            this.copied = true;

            setTimeout(() => {
                this.copied = false;
            }, 1000);
        },
        formatChange(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                .replace(/\*(.*?)\*/g, "<i>$1</i>");
        },
        angelAwardClass(level) {
            if (level?.featured !== "award") return "";
        
            const color = this.awards[level.id];
            return color ? `level-angel-${color}` : "default";
        }
    },
    watch: {
        search() {
            store.selected = null;
        },
        "store.selected"(val) {
            if (val === null) {
                this.$nextTick(() => {
                    this.animateCounter();
                });
            }
        }
    }
};
