<template>
    <div class="container-fluid">
        <div class="row">

            <div class="col-md-12">

            <div class="card">
                <div class="card-body">
                    <div class="col-md-12 text-right action-section">
                        <button type="button" class="btn btn-outline-success btn-lg">
                            <i class="fa fa-plus"></i> Add new project
                        </button>
                    </div>

                    <div class="col-md-12" v-if="projects.length <= 0">
                        <div class="alert alert-info" role="alert">You can't created projects</div>
                    </div>

                    <div class="col-md-12" v-if="projects.length > 0">

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
        mounted: function () {

        }
    }
</script>