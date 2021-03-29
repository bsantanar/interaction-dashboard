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
                        Description
                    </th>
                    <th class="text-left">
                        Version
                    </th>
                    <th class="text-left">
                        Link
                    </th>
                    <th class="text-left">
                        Tags
                    </th>
                    <th class="text-left">
                        Id
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in datasets"
                    :key="item.name"
                    >
                    <td>{{ item.name }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.version }}</td>
                    <td>{{ item.link }}</td>
                    <td>{{ item.tags }}</td>
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
    name: 'ListDataset',
    data: () => ({
        loading: true,
        errored: false,
        datasets: []
    }),
    mounted() {
        axios
            .get(`/dataset/`)
            .then(res => {
                this.datasets = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
}
</script>