<template>
    <v-row>
        <Snackbar v-if="errored" msg="Error from Server" />
        <Snackbar v-if="edited" msg="Operation Successfull" />
        <v-col cols="12">
            <v-select
            :items="items"
            :loading="loading"
            :disabled="loading"
            item-text="name"
            label="Select a category"
            dense
            return-object
            solo
            v-model="category"
            ></v-select>
        </v-col>
        <v-col v-if="category" cols="12">
        <v-form ref="form" v-model="valid">
            <v-col
            cols="6"
            >
            <v-text-field
                v-model="name"
                :rules="nameRules"
                :loading="loading"
                label="Name*"
                required
            ></v-text-field>
            </v-col>

            <v-col cols="6">
                <v-select
                :rules="sectionRules"
                :items="sections"
                :loading="loading"
                :disabled="loading"
                label="Select a section"
                dense
                solo
                v-model="section"
                ></v-select>

            </v-col>
            <v-col>
                <v-btn
                    depressed
                    :disabled="loading"
                    :loading="loading"
                    color="primary"
                    class="mr-4"
                    @click="submit"
                    >
                    Submit
                </v-btn>
            </v-col>
        </v-form>
        </v-col>
    </v-row>
</template>
<script>
import axios from '../../plugins/axios'
import Snackbar from '@/components/Snackbar.vue'
export default {
    name: 'EditCategory',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        category: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        name: '',
        section: '',
        sections: ['Publication', 'Activity', 'Member'],
        nameRules: [
            v => !!v || 'Name is required'
            // v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        sectionRules: [
            v => !!v || 'Description is required'
        ],
    }),
    watch: {
        category: function(item) {
            this.name = item.name
            this.section = item.section
        }
    },
    mounted() {
        this.loading = true
        axios
            .get(`/category/`)
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
            this.errored, this.edited = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {name, section, category} = this;
                axios.put(`/category/`,
                    {
                        condition: {_id: category._id},
                        data: {name, section}
                    })
                    .then(() => {
                        this.edited = true
                        this.$refs.form.reset()
                    })
                    .catch(err => {
                        console.error("error", err)
                        this.errored = true
                    })
                    .finally(() => {
                        this.loading = false
                    });
            }
        },
    },
}
</script>