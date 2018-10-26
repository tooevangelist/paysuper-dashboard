<template>
    <div>
        <sign-in></sign-in>
    </div>
</template>

<script>
    import SignIn from '../components/SignIn';

    export default {
        components: {SignIn},
        layout: 'login',
        head: {
            title: 'SignIn page'
        }
    }
</script>
