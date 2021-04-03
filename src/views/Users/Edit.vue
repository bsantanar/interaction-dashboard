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
            label="Select a user"
            dense
            return-object
            solo
            v-model="user"
            ></v-select>
        </v-col>
        <v-col v-if="user" cols="12">
        <v-form v-if="user" ref="form" v-model="valid">
            <v-col cols="6"
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
            cols="6"
            >
            <v-text-field
                v-model="password"
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
        </v-form>
        </v-col>
    </v-row>
</template>
<script>
import axios from '../../plugins/axios'
import Snackbar from '@/components/Snackbar.vue'
export default {
    name: 'EditUser',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        user: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        projects: [],
        name: '',
        password: null,
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
        emailRules: [
            v => !!v || 'Email is required',
            v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Not a valid Email'
        ],
        userTypeRules: [
            v => !!v || 'User Type is required'
            // v => v.length <= 10 || 'title must be less than 10 characters',
        ],
    }),
    watch: {
        user: function(item) {
            this.name = item.name
            this.email = item.email
            this.userType = this.userTypes.find(o => o.id === item.userType)
            this.project = item.projects
        }
    },
    mounted() {
        this.loading = true
        axios
            .get(`/user/`)
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
            console.log(this.userType)
            this.errored, this.edited = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {name, email, user, userType, password} = this;
                let data = {
                    name, 
                    email, 
                    userType: userType.id,
                    projects: [...this.project.map(p => p._id)]
                }
                if(password) data['password'] = password
                axios.put(`/user/`,
                    {
                        condition: {_id: user._id},
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