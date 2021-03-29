<template>
    <v-row>
        <Snackbar v-if="errored" msg="Error from Server" />
        <Snackbar v-if="edited" msg="Operation Successfull" />
        <v-col cols="12">
            <v-select
            :items="items"
            :loading="loading"
            :disabled="loading"
            item-text="email"
            label="Select an member"
            dense
            return-object
            solo
            v-model="member"
            ></v-select>
        </v-col>
        <v-col v-if="member" cols="12">
        <v-form ref="form" v-model="valid">
            <v-container>
            <v-row>
                <v-col
                cols="6"
                >
                    <v-text-field
                        v-model="fullName"
                        :rules="fullNameRules"
                        :loading="loading"
                        label="Full Name"
                        required
                    ></v-text-field>
                </v-col>
                <v-col
                cols="3"
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
                cols="3"
                >
                    <v-checkbox
                    v-model="active"
                    label="Active Member"
                    ></v-checkbox>
                </v-col>
                <v-col
                cols="4"
                >
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        :loading="loading"
                        label="Email"
                        required
                    ></v-text-field>
                </v-col>
                <v-col
                cols="4"
                >
                <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="contributionDate"
                    persistent
                    width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="contributionDate"
                        label="Contribution Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                    v-model="contributionDate"
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
                        @click="$refs.dialog.save(contributionDate)"
                    >
                        OK
                    </v-btn>
                    </v-date-picker>
                </v-dialog>
                </v-col>
                <v-col
                cols="4"
                >
                    <v-text-field
                        v-model="link"
                        :rules="linkRules"
                        :loading="loading"
                        label="Personal Page Url"
                    ></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-select
                    :rules="projectRules"
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
                <v-text-field
                    v-model="degree"
                    :rules="degreeRules"
                    :loading="loading"
                    label="Degree"
                    required
                ></v-text-field>
                </v-col>
                <v-col
                cols="12"
                >
                <v-textarea
                    counter
                    v-model="description"
                    :loading="loading"
                    rows="2"
                    label="Description"
                    required
                ></v-textarea>
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
    name: 'EditMember',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        member: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        modal: false,
        image: null,
        fullName: '',
        degree: '',
        projects: [],
        categories: [],
        project: [],
        active: true,
        category: null,
        contributionDate: new Date().toISOString().substr(0, 10),
        description: '',
        link: '',
        email: '',
        fullNameRules: [
            v => !!v || 'Full Name is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
        degreeRules: [
            v => !!v || 'Description is required'
        ],
        contributionDateRules: [
            v => !!v || 'Date is required'
        ],
        categoryRules: [
            v => !!v || 'Category is required'
        ],
        emailRules: [
            v => !!v || 'Email is required',
            v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Not a valid Email'
        ],
        projectRules: [
            v => !!v || 'Project is required',
            v => v.length > 0 || 'Must be in one project'
            // v => v.length <= 10 || 'title must be less than 10 characters',
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
        member: function(item) {
            this.fullName = item.fullName
            this.degree = item.degree
            this.project = item.projectsIds
            this.active = item.active,
            this.contributionDate = item.contributionDate.substr(0, 10),
            this.description = item.description,
            this.link = item.link,
            this.email = item.email,
            this.category = item.category
        }
    },
    async mounted() {
        this.loading = true
        axios
            .get(`/category/?section=Member`)
            .then(res => {
                this.categories = res.data.data
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
            })
        let r1 = axios.get('/member/dashboard')
                    .then((res) => this.items = res.data.data)
        let r2 = axios.get('/project/')
                    .then((res) => this.projects = res.data.data)
        await Promise.all([r1, r2])
                .then(() => this.loading = false)
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
                let {fullName, degree, project, image,
                        active, contributionDate, description, link,
                        email, member, category} = this;
                let data = {
                    fullName, 
                    degree,
                    projectsIds: project,
                    active,
                    contributionDate,
                    description,
                    link,
                    email,
                    category: category._id
                }
                if(image){
                    let fileToBase64 = await this.toBase64(image)
                    data['image'] = fileToBase64
                }
                axios.put(`/member/`,
                    {
                        condition: {_id: member._id},
                        data
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