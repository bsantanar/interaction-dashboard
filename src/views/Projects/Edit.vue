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
            label="Select a project"
            dense
            return-object
            solo
            v-model="project"
            ></v-select>
        </v-col>
        <v-col v-if="project" cols="12">
        <v-form ref="form" v-model="valid">
            <v-container>
            <v-row>
                <v-col
                cols="4"
                >
                <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    :loading="loading"
                    label="Name*"
                    required
                ></v-text-field>
                </v-col>
                <v-col
                cols="4"
                >
                <v-text-field
                    v-model="link"
                    :rules="linkRules"
                    :loading="loading"
                    label="Project url"
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
        </v-col>
    </v-row>
</template>
<script>
import axios from '../../plugins/axios'
import Snackbar from '@/components/Snackbar.vue'
export default {
    name: 'EditProject',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        project: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        name: '',
        description: '',
        link: '',
        image: null,
        nameRules: [
            v => !!v || 'Name is required'
            // v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
        linkRules: [
            v => !!v || 'Link is required',
            v => !! new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').test(v) || 'Must be a valid link'
        ],
        imageRules: [
            value => !value || value.size < 300000 || 'Image size should be less than 300 kB!',
        ]
    }),
    watch: {
        project: function(item) {
            this.name = item.name
            this.description = item.description
            this.link = item.link
            this.image = item.image ? item.image : null
        }
    },
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
            this.errored, this.edited = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {name, description, link, image, project} = this;
                let data = {
                    name,
                    description,
                    link
                }
                if(image){
                    let fileToBase64 = await this.toBase64(image)
                    data['image'] = fileToBase64
                }
                axios.put(`/project/`,
                    {
                        condition: {_id: project._id},
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