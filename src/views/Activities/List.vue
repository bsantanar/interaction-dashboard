<template>
    <div class="text-center" v-if="errored">
            <h3>ERROR ON SERVER</h3>
    </div>
    <div v-else>
        <div v-if="loading">
            <v-skeleton-loader
                class="mx-auto"
                max-width="300"
                type="table-thead, table-tbody"
            ></v-skeleton-loader>
        </div>
        <div v-else>
            <v-simple-table>
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-left">
                        Title
                    </th>
                    <th class="text-left">
                        Categories
                    </th>
                    <th class="text-left">
                        Date
                    </th>
                    <th class="text-left">
                        Id
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in activities"
                    :key="item.name"
                    >
                    <td>{{ item.title }}</td>
                    <td>{{ item.category.map(c => c.name) }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item._id }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>
<script>
import axios from '../../plugins/axios'
export default {
    name: 'ListActivity',
    data: () => ({
        loading: true,
        errored: false,
        activities: []
    }),
    mounted() {
        axios
            .get(`/activity/dashboard`)
            .then(res => {
                this.activities = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
}
</script>