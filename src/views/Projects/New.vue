<template>
    <div>
        <Snackbar v-if="errored" msg="Error from Server" />
        <Snackbar v-if="created" msg="Operation Successfull" />
        <v-form ref="form" v-model="valid">
            <v-container>
            <v-row>
                <v-col
                cols="12"
                lg="4"
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
                cols="12"
                lg="4"
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
                cols="3"
                >
                    <v-checkbox
                    v-model="personalPage"
                    label="Is A Personal Page?"
                    ></v-checkbox>
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
                cols="2"
                >
                    <v-text-field
                        :rules="yearRules"
                        :loading="loading"
                        v-model="yearInit"
                        label="Start Year*"
                        type="number"
                    ></v-text-field>
                </v-col>
                <v-col
                cols="2"
                >
                    <v-text-field
                        :loading="loading"
                        v-model="yearEnd"
                        label="End Year"
                        type="number"
                    ></v-text-field>
                </v-col>

                <v-col
                cols="12"
                sm="10"
                >
                <v-textarea
                    counter
                    v-model="description"
                    :rules="descriptionRules"
                    :loading="loading"
                    label="Description*"
                    required
                    rows="3"
                ></v-textarea>
                </v-col>
                <v-col cols="6">
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
    name: 'NewProject',
    components: {
        Snackbar
    },
    data: () => ({
        valid: false,
        loading: false,
        errored: false,
        created: false,
        yearInit: null,
        yearEnd: null,
        name: '',
        description: '',
        link: '',
        image: null,
        personalPage: false,
        nameRules: [
            v => !!v || 'Name is required'
            // v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
        yearRules: [
            v => !!v || 'Start year is required'
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
            value => !value || value.size < 300000 || 'Image size should be less than 300 KB!',
        ]
    }),
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
                let {name, description, link, 
                    image, yearInit, yearEnd,
                    personalPage} = this;
                let data = {
                    name,
                    description,
                    link,
                    yearInit,
                    yearEnd: yearEnd ? yearEnd : null,
                    personalPage
                }
                if(image){
                    let fileToBase64 = await this.toBase64(image)
                    data['image'] = fileToBase64
                }
                axios.post(`/project/`, data)
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