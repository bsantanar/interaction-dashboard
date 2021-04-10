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
                        Year
                    </th>
                    <th class="text-left">
                        Author
                    </th>
                    <th class="text-left">
                        Category
                    </th>
                    <th class="text-left">
                        Projects
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in publications"
                    :key="item.name"
                    >
                    <td>{{ item.title }}</td>
                    <td>{{ item.year }}</td>
                    <td>{{ item.author }}</td>
                    <td>{{ item.category.map(c => c.name) }}</td>
                    <td>{{ item.projectId.map(p => p.name) }}</td>
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
    name: 'ListPublication',
    data: () => ({
        loading: true,
        errored: false,
        publications: []
    }),
    mounted() {
        axios
            .get(`/publication/dashboard`)
            .then(res => {
                this.publications = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
}
</script>