<template>
    <div>

    <v-row>
        <Snackbar v-if="errored" msg="Error from Server" />
        <Snackbar v-if="deleted" msg="Operation Successfull" />
        <v-col cols="8">
            <v-select
            :items="items"
            :loading="loading"
            :disabled="loading"
            item-text="title"
            label="Select a publication"
            dense
            return-object
            solo
            v-model="publication"
            ></v-select>
        </v-col>
        <v-col cols="4">
            <v-btn 
            depressed 
            :disabled="loading"
            :loading="loading"
            @click="selected = !selected"
            >
                Delete
            </v-btn>
        </v-col>
    </v-row>
    <div v-if="selected">
        <v-row>
            <v-col cols="6">
                <p>Are you sure to delete <b>{{publication.title}}</b>?</p>
            </v-col>
            <v-col cols="4">
                <v-btn 
                class="mr-2"
                :disabled="loading"
                :loading="loading"
                depressed
                @click="submit"
                >
                    Delete
                </v-btn>
                <v-btn
                depressed
                :disabled="loading"
                color="primary"
                @click="selected = !selected"
                >
                    Cancel
                </v-btn>
            </v-col>
    </v-row>
        </div>
    </div>
</template>
<script>
import axios from '../../plugins/axios'
import Snackbar from '@/components/Snackbar.vue'
export default {
    name: 'EditPublication',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        publication: null,
        valid: false,
        loading: false,
        errored: false,
        selected: false,
        deleted: false,
        name: '',
        description: '',
        nameRules: [
            v => !!v || 'Name is required'
            // v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
    }),
    mounted() {
        this.loading = true
        axios
            .get(`/publication/dashboard`)
            .then(res => {
                this.items = res.data.data
                this.loading = false
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
                this.loading = false
            })
    },
    methods: {
        submit () {
            this.errored, this.deleted = false
            this.loading = !this.loading;
            let {publication} = this;
            axios.delete(`/publication/`,
                {data: {_id: publication._id}})
                .then(() => {
                    this.deleted = true
                    this.selected = false
                    this.items = this.items.filter(a => a._id !== publication._id)
                })
                .catch(err => {
                    console.error("error", err)
                    this.errored = true
                })
                .finally(() => {
                    this.loading = false
                });
        },
    },
}
</script>