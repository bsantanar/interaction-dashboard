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
            label="Select an activity"
            dense
            return-object
            solo
            v-model="activity"
            ></v-select>
        </v-col>
        <v-col v-if="activity" cols="12">
        <v-form ref="form" v-model="valid">
            <v-container>
            <v-row>
                <v-col
                cols="12"
                >
                    <v-text-field
                        v-model="title"
                        :rules="titleRules"
                        :loading="loading"
                        label="Title"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-select
                    :rules="projectRules"
                    :items="projects"
                    :loading="loading"
                    :disabled="loading"
                    item-text="name"
                    label="Select a project"
                    dense
                    return-object
                    solo
                    v-model="project"
                    ></v-select>

                </v-col>
                <v-col
                cols="6"
                >
                    <v-file-input
                        :rules="imageRules"
                        v-model="image"
                        show-size
                        accept="image/*"
                        label="File input"
                    ></v-file-input>
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
                    solo
                    v-model="category"
                    ></v-select>

                </v-col>
                <v-col
                cols="4"
                >
                <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        label="Picker in dialog"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                    v-model="date"
                    scrollable
                    :first-day-of-week="1"
                    locale="es-ES"
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="modal = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(date)"
                    >
                        OK
                    </v-btn>
                    </v-date-picker>
                </v-dialog>
                </v-col>
                <v-col cols="4">
                <v-text-field
                    v-model="link"
                    :rules="linkRules"
                    :loading="loading"
                    label="Link"
                ></v-text-field>

                </v-col>
                <v-col
                cols="12"
                >
                <v-textarea
                    counter
                    v-model="description"
                    :rules="descriptionRules"
                    :loading="loading"
                    rows="2"
                    label="Description"
                    required
                ></v-textarea>
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
    name: 'EditActivity',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        projects: [],
        activity: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        modal: false,
        image: null,
        title: '',
        description: '',
        category: null,
        link: '',
        date: null,
        project: null,
        categories: [],
        titleRules: [
            v => !!v || 'Title is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        projectRules: [
            v => !!v || 'Project is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
        categoryRules: [
            v => !!v || 'Category is required'
        ],
        imageRules: [
            value => !value || value.size < 100000 || 'Image size should be less than 100 KB!',
        ],
        linkRules: [
            v => !! new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').test(v) || 'Must be a valid link'
        ],
    }),
    watch: {
        activity: function(item) {
            this.title = item.title
            this.link = item.link
            this.description = item.description
            this.project = item.projectId
            this.date = item.date.substr(0, 10)
            this.category = item.category
            //this.tool = item.toolId
        }
    },
    mounted() {
        this.loading = true
        axios
            .get(`/activity/dashboard`)
            .then(res => {
                this.items = res.data.data
                this.loading = false
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
                this.loading = false
            })
        axios.get('/project/')
            .then((res) => this.projects = res.data.data)
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
        axios
            .get(`/category/?section=Activity`)
            .then(res => {
                this.categories = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
    },
    methods: {
        toBase64(file) {
            return new Promise((resolve, reject) => {
                const fr = new FileReader()
                fr.readAsDataURL(file);
                fr.onload = () => resolve(fr.result);
                fr.onerror = error => reject(error);
            })
        },
        async submit () {
            this.errored, this.edited = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {title, description, date, category,
                    activity, image, link, project} = this;
                let data = {
                    title, 
                    description,
                    link,
                    date,
                    projectId: project? project._id : null,
                    // toolId: tool? tool._id : null,
                    category: category._id
                }
                if(image) {
                    let fileToBase64 = await this.toBase64(image)
                    data['image'] = fileToBase64
                }
                axios.put(`/activity/`,
                    {
                        condition: {_id: activity._id},
                        data
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