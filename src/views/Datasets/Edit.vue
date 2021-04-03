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
            label="Select a dataset"
            dense
            return-object
            solo
            v-model="dataset"
            ></v-select>
        </v-col>
        <v-col v-if="dataset" cols="12">
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
                    <v-combobox
                    v-model="tags"
                    hint="Press enter to add more tags"
                    :rules="tagsRules"
                    label="Tags"
                    multiple
                    chips
                    ></v-combobox>
                </v-col>
                <v-col
                cols="4"
                >
                <v-text-field
                    v-model="version"
                    :rules="versionRules"
                    :loading="loading"
                    label="Version"
                    type="number"
                    required
                ></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-select
                    :rules="publicationsRules"
                    :items="publicationsArray"
                    :loading="loading"
                    :disabled="loading"
                    item-text="title"
                    label="Select publications"
                    dense
                    return-object
                    multiple
                    chips
                    v-model="publications"
                    ></v-select>

                </v-col>
                <v-col
                cols="4"
                >
                <v-text-field
                    v-model="link"
                    :rules="linkRules"
                    :loading="loading"
                    label="Link"
                ></v-text-field>
                </v-col>
                <v-col
                cols="4"
                >
                    <v-checkbox
                    v-model="permission"
                    label="Requires form"
                    ></v-checkbox>
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
    name: 'EditDataset',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        publicationsArray: [],
        dataset: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        name: '',
        description: '',
        version: 1,
        tags: [],
        publications: [],
        link: '',
        permission: false,
        nameRules: [
            v => !!v || 'Name is required'
            // v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
        tagsRules: [
            v => !!v || 'Tags are required',
            v=> v.length > 0 || 'Must have one'
        ],
        publicationsRules: [
            v => !!v || 'Publications are required',
            v=> v.length > 0 || 'Must have one'
        ],
        linkRules: [
            v => !! new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i').test(v) || 'Must be a valid link'
        ],
        versionRules: [
            v => !!v || 'Version is required'
        ]
    }),
    watch: {
        dataset: function(item) {
            this.name = item.name
            this.description = item.description
            this.version = item.version,
            this.tags = item.tags,
            this.publications = item.publications,
            this.link = item.link,
            this.permission = item.permission
        }
    },
    mounted() {
        this.loading = true
        axios
            .get(`/publication/`)
            .then(res => {
                this.publicationsArray = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
        axios
            .get(`/dataset/`)
            .then(res => {
                this.items = res.data.data
                this.loading = false
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
            .finally(() => this.loading = false)
    },
    methods: {
        submit () {
            this.errored, this.edited = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {name, description, tags, version, link, permission,
                        publications, dataset} = this;
                axios.put(`/dataset/`,
                    {
                        condition: {_id: dataset._id},
                        data: {
                            name, 
                            description, 
                            tags, 
                            version, 
                            link,
                            permission, 
                            publications: publications.map(p => p._id)
                        }
                    })
                    .then((res) => {
                        this.items = this.items
                            .map(i => res.data.data._id == i._id ? 
                                    res.data.data : i)
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