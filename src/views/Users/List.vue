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
                        Name
                    </th>
                    <th class="text-left">
                        Email
                    </th>
                    <th class="text-left">
                        User Type
                    </th>
                    <th class="text-left">
                        Id
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in users"
                    :key="item.email"
                    >
                    <td>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.userType === 1 ? 
                            'Administrator' : 'Mantainer' }}</td>
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
    name: 'ListUser',
    data: () => ({
        loading: true,
        errored: false,
        users: []
    }),
    mounted() {
        axios
            .get('/user/')
            .then(res => {
                this.users = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
}
</script>