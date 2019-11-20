<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'LoginPage',

  computed: {
    ...mapState(['config']),
    ...mapGetters('User', ['authIframeSrc']),
  },

  created() {
    this.handleInviteToken();
    this.listenToMessages();
  },

  methods: {
    ...mapActions('User', ['initState', 'setAccessToken', 'setInviteToken']),
    listenToMessages() {
      window.addEventListener('message', async (event) => {
        if (!event.data || event.data.source !== 'PAYSUPER_MANAGEMENT_SERVER') {
          return;
        }

        if (event.data.access_token && event.data.success) {
          this.setAccessToken(event.data.access_token);
          await this.initState();
          this.redirectOnSuccessfulAuth();
        }

        if (event.data.error === 'user-already-logged') {
          this.redirectOnSuccessfulAuth();
        }
      });

      window.addEventListener('message', (event) => {
        if (event.data && event.data.source !== 'P1_AUTH_FORM') {
          return;
        }
        if (event.data.name === 'formResize') {
          const { width, height } = event.data.data;
          if (this.$refs.iframe) {
            this.$refs.iframe.setAttribute('width', width);
            this.$refs.iframe.setAttribute('height', height);
          }
        }
      });
    },

    async handleInviteToken() {
      const { name, query } = this.$route;
      const { invite_token: inviteToken, ...restQuery } = query;
      if (inviteToken) {
        await this.setInviteToken(inviteToken);
        this.$navigate({ name, query: restQuery });
      }
    },

    redirectOnSuccessfulAuth() {
      if (this.$route.query.redirect) {
        this.$router.push({ path: this.$route.query.redirect });
      } else {
        this.$router.push({ path: '/' });
      }
    },
  },
};
</script>

<template>
<div class="login-page">
  <iframe
    class="iframe"
    ref="iframe"
    width="360"
    height="200"
    :src="authIframeSrc"
    frameborder="0"
  ></iframe>
</div>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  justify-content: center;
}

.iframe {
}
</style>
