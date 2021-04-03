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
            label="Select a tool"
            dense
            return-object
            solo
            v-model="tool"
            ></v-select>
        </v-col>
        <v-col v-if="tool" cols="12">
        <v-form ref="form" v-model="valid">
            <v-col
            cols="12"
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
        </v-form>
        </v-col>
    </v-row>
</template>
<script>
import axios from '../../plugins/axios'
import Snackbar from '@/components/Snackbar.vue'
export default {
    name: 'EditTool',
    components: {
        Snackbar
    },
    data: () => ({
        items: [],
        tool: null,
        valid: false,
        loading: false,
        errored: false,
        edited: false,
        name: '',
        description: '',
        nameRules: [
            v => !!v || 'Name is required'
            // v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
    }),
    watch: {
        tool: function(item) {
            this.name = item.name
            this.description = item.description
        }
    },
    mounted() {
        this.loading = true
        axios
            .get(`/tool/`)
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
        submit () {
            this.errored, this.edited = false
            if(this.$refs.form.validate()){
                this.loading = !this.loading;
                let {name, description, tool} = this;
                axios.put(`/tool/`,
                    {
                        condition: {_id: tool._id},
                        data: {name, description}
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