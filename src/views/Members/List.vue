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
                        Full Name
                    </th>
                    <th class="text-left">
                        Degree
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in members"
                    :key="item.name"
                    >
                    <td>{{ item.fullName }}</td>
                    <td>{{ item.degree }}</td>
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
    name: 'ListMember',
    data: () => ({
        loading: true,
        errored: false,
        members: []
    }),
    mounted() {
        axios
            .get(`/member/dashboard`)
            .then(res => {
                this.members = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
}
</script>