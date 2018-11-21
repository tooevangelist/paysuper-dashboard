<template>
    <div class="modal" v-bind:class="{ 'show': show }">
        <div class="content">
            <slot name="header">
                <div class="header">
                    <span class="close" v-if="showCloseBtn === true" @click="close">&times;</span>
                    <h2>Modal Header</h2>
                </div>
            </slot>
            <div class="body">
                <slot name="body">
                    <p>Some text in the Modal Body</p>
                    <p>Some other text...</p>
                </slot>
            </div>
            <slot name="footer">
                <div class="footer">
                    <h3>Modal Footer</h3>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            showCloseBtn: {
                'type': Boolean,
                'default': true
            },
            isOpen: {
                'type': Boolean,
                'default': false
            },
            closeOnMissClick: {
                'type': Boolean,
                'default': true
            }
        },
        data: function () {
            return {
                show: this.isOpen,
                rnd: Math.random() * 999999999,
            }
        },
        methods: {
            close: function () {
                this.show = false;

                this.$emit('onClosed');
            },
        },
        watch: {
            isOpen: function (value) {
                this.show = value;
            }
        },
        mounted: function () {
            this.show = this.isOpen;
        }
    };
</script>

<style lang="scss">
    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        padding-top: 2px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0, 0, 0, 0.6);
        color: #23282c;

        &.show {
            display: block;
        }

        .content {
            position: relative;
            background-color: #fefefe;
            margin: auto;
            padding: 5px 0 0 0;
            border: 1px solid #888;
            width: 590px;
            height: 630px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            -webkit-animation-name: animatetop;
            -webkit-animation-duration: 0.4s;
            animation-name: animatetop;
            animation-duration: 0.4s;
            text-align: center;
        }

        .header,
        .body,
        .footer {
            padding: 2px 16px;
        }

        .header,
        .footer {
            background-color: #e4e5e6;
        }
    }

    @-webkit-keyframes animatetop {
        from {top:-300px; opacity:0}
        to {top:0; opacity:1}
    }

    @keyframes animatetop {
        from {top:-300px; opacity:0}
        to {top:0; opacity:1}
    }
    .close {
        color: white;
        float: right;
        font-size: 28px;
        font-weight: bold;

        &:hover,
        &:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }
    }
</style>