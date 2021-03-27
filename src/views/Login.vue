<template>
    <div>
    <Snackbar v-if="errored" msg="Invalid Credentials" />
    <h1>Login</h1>
    <v-form ref="form" v-model="valid">
    <v-container>
        <v-row>
            <v-col cols="8">
                <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    :loading="loading"
                    label="Email"
                    required
                ></v-text-field>
            </v-col>
            <v-col cols="8">
                <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="show1 ? 'text' : 'password'"
                    :loading="loading"
                    label="Password"
                    required
                    @click:append="show1 = !show1"
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
    </div>
</template>
<script>
import axios from '../plugins/axios'
import Snackbar from '@/components/Snackbar.vue'

export default {
    name: 'Login',
    components: {
        Snackbar
    },
    data: () => ({
        valid: false,
        loading: false,
        errored: false,
        show1: false,
        name: '',
        password: '',
        email: '',
        passwordRules: [
            v => !!v || 'password is required'
        ],
        emailRules: [
            v => !!v || 'Email is required',
            v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Not a valid Email'
        ],
    }),
    methods: {
        submit () {
            this.errored = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {password, email} = this;
                axios.post(`/user/login`,
                    {email, password})
                    .then(res => {
                        console.log(res)
                        localStorage.setItem('token', res.data.token)
                        localStorage.setItem('user', JSON.stringify(res.data.user))
                        this.$router.push({name: 'Home'})
                        this.$router.go()
                    })
                    .catch(err => {
                        this.errored = true
                        console.error("error", err)
                    })
                    .finally(() => {
                        this.loading = false
                    });
            }
        },
    },
}
</script>