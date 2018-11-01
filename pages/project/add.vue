<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <project v-bind:project="{}"></project>
            </div>
        </div>
    </div>
</template>

<script>
    import Project from '../../components/Project';

    export default {
        middleware: 'IsNotAuthenticated',
        components: {Project},
        data: function () {
            return {}
        }
    }
</script>