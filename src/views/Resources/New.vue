<template>
    <div>
        <Snackbar v-if="errored" msg="Error from Server" />
        <Snackbar v-if="created" msg="Operation Successfull" />
        <v-form ref="form" v-model="valid">
            <v-container>
            <v-row>
                <v-col
                cols="6"
                >
                    <v-text-field
                        v-model="title"
                        :rules="titleRules"
                        :loading="loading"
                        label="Title*"
                        required
                    ></v-text-field>
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
                <v-col>
                    <v-select
                    :rules="projectRules"
                    :items="items"
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
                <v-col>
                <v-text-field
                    v-model="url"
                    :loading="loading"
                    label="Url"
                ></v-text-field>

                </v-col>
                <v-col
                cols="12"
                >
                <v-text-field
                    v-model="description"
                    :rules="descriptionRules"
                    :loading="loading"
                    label="Description*"
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
    title: 'NewResource',
    components: {
        Snackbar
    },
    data: () => ({
        valid: false,
        loading: false,
        errored: false,
        created: false,
        items: [],
        image: null,
        title: '',
        description: '',
        url: '',
        project: null,
        titleRules: [
            v => !!v || 'Title is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
        projectRules: [
            v => !!v || 'Project is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        imageRules: [
            value => !value || value.size < 100000 || 'Image size should be less than 100 KB!',
        ]
    }),
    mounted() {
        this.loading = true
        axios
            .get(`/project/`)
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
        toBase64(file) {
            return new Promise((resolve, reject) => {
                const fr = new FileReader()
                fr.readAsDataURL(file);
                fr.onload = () => resolve(fr.result);
                fr.onerror = error => reject(error);
            })
        },
        async submit () {
            this.errored, this.created = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {title, description, project, image, url} = this;
                let data = {
                    title, 
                    description,
                    projectId: project._id,
                    url
                }
                if(image){
                    let fileToBase64 = await this.toBase64(image)
                    data['image'] = fileToBase64
                }
                axios.post(`/resource/`,
                    data)
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