import creators from '../dataextra/creators.json';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    data: () => ({
        creators: [],
        loading: true
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-creators">
            <table class="board">
                <tr v-for="(c, i) in creators">
                    <td class="rank">#{{ i + 1 }}</td>
                    <td class="user">{{ c.user }}</td>
                    <td class="points">{{ c.points }}</td>
                    <td class="featured">{{ c.featured.join(', ') }}</td>
                    <td class="best">{{ c.best }}</td>
                </tr>
            </table>
        </main>
    `,
    mounted() {
        // optional: sort by points
        this.creators = creators.sort((a, b) => b.points - a.points);
        this.loading = false;
    }
};