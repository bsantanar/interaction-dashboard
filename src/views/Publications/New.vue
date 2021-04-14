<template>
    <div>
        <Snackbar v-if="errored" msg="Error from Server" />
        <Snackbar v-if="created" msg="Operation Successfull" />
        <v-form ref="form" v-model="valid">
            <v-container>
            <v-row>
                <v-col
                cols="8"
                >
                    <v-text-field
                        v-model="title"
                        :rules="titleRules"
                        :loading="loading"
                        label="Title*"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-select
                    :rules="categoryRules"
                    :items="categories"
                    :loading="loading"
                    :disabled="loading"
                    item-text="name"
                    label="Select a category"
                    dense
                    return-object
                    multiple
                    chips
                    v-model="category"
                    ></v-select>

                </v-col>
                <v-col cols="6">
                    <v-select
                    :rules="projectRules"
                    :items="items"
                    :loading="loading"
                    :disabled="loading"
                    item-text="name"
                    label="Select a project"
                    dense
                    return-object
                    multiple
                    chips
                    v-model="project"
                    ></v-select>

                </v-col>
                <v-col
                cols="6"
                >
                    <v-text-field
                        :loading="loading"
                        v-model="doi"
                        label="DOI"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                <v-text-field
                    v-model="author"
                    :loading="loading"
                    :rules="authorRules"
                    required
                    label="Author*"
                ></v-text-field>

                </v-col>
                <v-col
                cols="3"
                >
                    <v-text-field
                        :rules="yearRules"
                        :loading="loading"
                        v-model="year"
                        label="Year*"
                        type="number"
                    ></v-text-field>
                </v-col>
                <v-col cols="3">
                <v-text-field
                    v-model="editorial"
                    :loading="loading"
                    required
                    label="Index"
                ></v-text-field>

                </v-col>
                <v-col
                cols="12"
                >
                <v-text-field
                    v-model="description"
                    :rules="descriptionRules"
                    :loading="loading"
                    label="Details (Proceedings, Journal, Location, Editorial, etc.) in APA Style*"
                    required
                ></v-text-field>
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
            </v-row>
            </v-container>
        </v-form>
    </div>
</template>
<script>
import axios from '../../plugins/axios'
import Snackbar from '@/components/Snackbar.vue'

export default {
    title: 'NewPublication',
    components: {
        Snackbar
    },
    data: () => ({
        valid: false,
        loading: false,
        errored: false,
        created: false,
        items: [],
        year: null,
        title: '',
        description: '',
        author: '',
        editorial: '',
        doi: '',
        category: [],
        project: [],
        categories: [],
        titleRules: [
            v => !!v || 'Title is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
        categoryRules: [
            v => v.length > 0 || 'Must have one category'
        ],
        projectRules: [
            v => !!v || 'Project is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        // doiRules: [
        //     v => 
        // ],
        yearRules: [
            value => !!value || 'Year is required',
        ],
        authorRules: [
            value => !!value || 'Author is required'
        ]
    }),
    mounted() {
        this.loading = true
        axios
            .get(`/category/?section=Publication`)
            .then(res => {
                this.categories = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
        axios
            .get(`/project/`)
            .then(res => {
                this.items = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
    methods: {
        submit () {
            this.errored, this.created = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {title, description, doi,
                        project, year, author, editorial,
                        category} = this;
                axios.post(`/publication/`,
                    {
                        title, 
                        description,
                        author, 
                        year,
                        editorial,
                        category: category.map(c => c._id),
                        doi,
                        projectId: project.map(p => p._id)
                    })
                    .then(() => {
                        this.created = true
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