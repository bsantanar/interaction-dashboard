<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      v-if="isLogged"
    >
      <v-sheet
        color="grey lighten-4"
        class="pa-4"
      >

        <div>{{getUser.email}}</div>
        <v-btn 
        class="mt-2"
        elevation="1"
        @click="logout"
        >
            Logout
        </v-btn>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-group
          no-action
          sub-group
          v-for="text in getMenu"
          :key="text.name"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{text.name}}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="action in actions"
            :key="action"
            :to="`/${text.name}/${action}`"
            link
          >
            <v-list-item-title v-text="action"></v-list-item-title>

          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      sections: [
        {name: 'Projects', type: 1},
        {name: 'Datasets', type: 1},
        {name: 'Activities', type: 3},
        {name: 'Publications', type: 2},
        {name: 'Categories', type: 2},
        {name: 'Resources', type: 2},
        {name: 'Members', type: 2},
        {name: 'Users', type: 1},
      ],
      actions: [
        'List',
        'New',
        'Edit',
        'Delete'
      ]
    }),
    computed: {
      getMenu: function(){
        return this.sections.filter(a => a.type >= JSON.parse(localStorage.getItem('user')).userType)
      },
      getUser: function(){
        return JSON.parse(localStorage.getItem('user'))
      },
      isLogged: function(){
        return !!localStorage.getItem('token')
                && !!localStorage.getItem('user')
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$router.push({name: 'Login'})
        this.$router.go()
      }
    }
  }
</script>