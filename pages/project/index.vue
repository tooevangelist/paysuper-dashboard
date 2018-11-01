<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <div class="col-md-12 text-right action-section">
                            <nuxt-link type="button" class="btn btn-outline-success btn-lg" to="/project/add"
                                       active-class="" tag="button">
                                <i class="fa fa-plus"></i> Add new project
                            </nuxt-link>
                        </div>

                        <div class="col-md-12" v-if="projects.length <= 0">
                            Projects list is empty
                        </div>

                        <div class="row" v-if="projects.length > 0">
                            <div class="col-4 ccol-4 field-group mr-1 list" v-for="(item, index) in projects"
                                 v-bind:key="index">
                                <div class="col-12 text-center item">
                                    <strong>Name: </strong> {{ item['name'] }}
                                </div>
                                <div class="col-12 text-center item">
                                    <strong>Is active: </strong> {{ item['is_active'] === true ? 'Yes' : 'No' }}
                                </div>
                                <div class="col-12 text-center item button">
                                    <nuxt-link type="button" class="btn btn-outline-success btn-sm" v-bind:to="'/project/' + item['id']"
                                               active-class="" tag="button">
                                        <i class="fa fa-pencil"></i> Edit project
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        middleware: 'IsNotAuthenticated',
        data: function () {
            return {
                projects: []
            }
        },
        methods: {},
        mounted: function () {
            const self = this;

            axios.get(`${process.env.apiServerUrl}/s/project`, {
                headers: {Authorization: `Bearer ${this['$store'].state.user.accessToken}`}
            }).then(function (response) {
                self.projects = response.data;
            }).catch(function () {});
        }
    }
</script>