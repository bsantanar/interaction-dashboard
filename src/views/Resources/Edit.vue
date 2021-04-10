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
            label="Select an resource"
            dense
            return-object
            solo
            v-model="resource"
            ></v-select>
        </v-col>
        <v-col v-if="resource" cols="12">
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
                    <v-text-field
                    v-model="url"
                    :loading="loading"
                    label="Url"
                    ></v-text-field>
                </v-col>
                <v-col
                cols="6"
                >
                <v-text-field
                    v-model="description"
                    :rules="descriptionRules"
                    :loading="loading"
                    label="Description*"
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="12">
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
    name: 'EditResource',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        resource: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        image: null,
        title: '',
        description: '',
        url: [],
        titleRules: [
            v => !!v || 'Full Name is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
        urlRules: [
            v => !!v || 'url is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        imageRules: [
            value => !value || value.size < 100000 || 'Image size should be less than 100 KB!',
        ]
    }),
    watch: {
        resource: function(item) {
            this.title = item.title
            this.description = item.description
            this.url = item.url
        }
    },
    mounted() {
        this.loading = true
        axios
            .get(`/resource/dashboard`)
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
                let {title, description, resource, image, url} = this;
                let data = {
                    title, 
                    description,
                    url
                }
                if(image){
                    let fileToBase64 = await this.toBase64(image)
                    data['image'] = fileToBase64
                }
                axios.put(`/resource/`,
                    {
                        condition: {_id: resource._id},
                        data
                    })
                    .then((res) => {
                        this.items = this.items
                            .map(i => res.data.data._id == i._id ? 
                                    res.data.data : i)
                        this.edited = true
                        this.$refs.form.reset()
                        this.resource = null
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