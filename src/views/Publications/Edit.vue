<template>
    <v-row>
        <Snackbar v-if="errored" msg="Error from Server" />
        <Snackbar v-if="edited" msg="Operation Successfull" />
        <v-col cols="12">
            <v-select
            :items="items"
            :loading="loading"
            :disabled="loading"
            item-text="title"
            label="Select an publication"
            dense
            return-object
            solo
            v-model="publication"
            ></v-select>
        </v-col>
        <v-col v-if="publication" cols="12">
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
                    :items="projects"
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
                <v-col cols="6">
                    <v-text-field
                        :loading="loading"
                        v-model="doi"
                        label="DOI"
                    ></v-text-field>
                </v-col>
                <v-col
                cols="6"
                >
                    <v-text-field
                        v-model="author"
                        :loading="loading"
                        :rules="authorRules"
                        required
                        label="Author*"
                    ></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        :rules="yearRules"
                        :loading="loading"
                        v-model="year"
                        label="Year*"
                        type="number"
                    ></v-text-field>

                </v-col>
                <v-col>
                    
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
        </v-col>
    </v-row>
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
        projects: [],
        publication: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        year: null,
        title: '',
        description: '',
        editorial: '',
        category: [],
        author: '',
        doi: '',
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
        yearRules: [
            value => !!value || 'Year is required',
        ],
        authorRules: [
            value => !!value || 'Author is required'
        ],
        projectRules: [
            v => !!v || 'Project is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
    }),
    watch: {
        publication: function(item) {
            this.title = item.title
            this.author = item.author
            this.description = item.description
            this.year = item.year
            this.project = item.projectId
            // this.tool = item.toolsId
            this.category = item.category
            this.editorial = item.editorial
            this.doi = item.doi
        }
    },
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
        axios
            .get(`/project/`)
            .then(res => {
                this.projects = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
            })
        axios
            .get(`/category/?section=Publication`)
            .then(res => {
                this.categories = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
    },
    methods: {
        submit () {
            this.errored, this.edited = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {title, description, publication, year, 
                    author, project, editorial, category} = this;
                let data = {
                    title, 
                    description,
                    year,
                    author,
                    category: category.map(c => c._id),
                    editorial,
                    projectId: project.map(p => p._id)
                }
                axios.put(`/publication/`,
                    {
                        condition: {_id: publication._id},
                        data
                    })
                    .then(() => {
                        this.edited = true
                        this.$refs.form.reset()
                        this.publication = null
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