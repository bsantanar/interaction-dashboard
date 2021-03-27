<template>
    <v-snackbar
        :value="true"
        color="blue-grey"
        timeout=2000
        rounded="pill"
        top
    >
      {{ msg }}
    </v-snackbar>
</template>
<script>
export default {
    name: 'Snackbar',
    props: ['msg']
}
</script>