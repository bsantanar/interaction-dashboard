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
                    v-model="name"
                    :rules="nameRules"
                    :loading="loading"
                    label="Name"
                    required
                ></v-text-field>
                </v-col>
                <v-col
                cols="6"
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
                cols="6"
                >
                <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    append-icon="mdi-autorenew"
                    :loading="loading"
                    label="Password"
                    required
                    @click:append="randomPassword"
                ></v-text-field>
                </v-col>
                <v-col
                cols="6"
                >
                    <v-select
                    :rules="userTypeRules"
                    :items="userTypes"
                    :loading="loading"
                    :disabled="loading"
                    item-text="name"
                    label="Select a user type"
                    dense
                    return-object
                    solo
                    v-model="userType"
                    ></v-select>
                </v-col>
                <v-col
                v-if="userType && userType.id >= 2"
                cols="6"
                >
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
    </div>
</template>
<script>
import axios from '../../plugins/axios'
import Snackbar from '@/components/Snackbar.vue'

export default {
    name: 'NewUser',
    components: {
        Snackbar
    },
    data: () => ({
        valid: false,
        loading: false,
        errored: false,
        created: false,
        projects: [],
        name: '',
        password: '',
        email: '',
        project: [],
        userType: null,
        userTypes: [{name: 'Administrator', id: 1}, 
                    {name: 'Mantainer', id: 2}, 
                    {name: 'Content Creator', id: 3}],
        nameRules: [
            v => !!v || 'Name is required'
            // v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        passwordRules: [
            v => !!v || 'Password is required'
        ],
        emailRules: [
            v => !!v || 'Email is required',
            v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Not a valid Email'
        ],
        userTypeRules: [
            v => !!v || 'User Type is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
    }),
    mounted() {
        this.loading = true
        axios
            .get(`/project/`)
            .then(res => {
                this.projects = res.data.data
                this.loading = false
            })
            .catch(err => {
                console.error("axios err", err)
                this.errored = true
                this.loading = false
            })
    },
    methods: {
        randomPassword() {
            this.password = Math.random().toString(36).slice(-8);
        },
        submit () {
            this.errored, this.created = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {name, password, email, userType} = this;
                axios.post(`/user/`,
                    {
                        name, 
                        password, 
                        email, 
                        userType: userType.id,
                        projects: this.project.map(p => p._id)
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