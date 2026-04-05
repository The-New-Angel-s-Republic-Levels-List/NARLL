import { fetchCreators } from '../content.js';

import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },

    data: () => ({
        creators: [],
        loading: true,
        err: null
    }),

    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-creators">
            <p v-if="err" class="error">{{ error }}</p>

            <table v-else class="board">
                <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Points</th>
                    <th>Featured</th>
                    <th>Best</th>
                </tr>

                <tr v-for="(c, i) in creators">
                    <td>#{{ i + 1 }}</td>
                    <td class="user">
                        <span class="type-label-lg">{{ c.user }}</span>
                    </td>
                    <td>{{ c.points }}</td>
                    <td>{{ c.featured.join(', ') }}</td>
                    <td>{{ c.best }}</td>
                </tr>
            </table>
        </main>
    `,

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