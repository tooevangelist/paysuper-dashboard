<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <project v-bind:project="project"></project>
            </div>
        </div>
    </div>
</template>

<script>
    import Notifications from '../../mixins/notificaton';
    import Project from '../../components/Project';
    import axios from 'axios';

    export default {
        middleware: 'IsNotAuthenticated',
        components: { Project },
        mixins: [Notifications],
        asyncData: function(context) {
            return axios.get(`${process.env.apiServerUrl}/s/project/${context.route['params']['id']}`, {
                headers: {Authorization: `Bearer ${context.store.state.user.accessToken}`}
            }).then(function (response) {
                return {
                    project: response.data
                };
            }).catch(function (e) {
                self.error(self.getError(e));
                self['$router'].push('/project');
            });
        }
    }
</script>