<template>
  <div class="login-page">
    <iframe class="iframe" width="360" height="500" :src="iframeSrc" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'LoginPage',

  computed: {
    ...mapState(['config']),
    iframeSrc() {
      return `${this.config.ownBackendUrl}/auth1/login`;
    },
  },

  created() {
    this.listenToMessages();
  },

  methods: {
    ...mapActions('User', ['setAccessToken']),
    listenToMessages() {
      window.addEventListener('message', (event) => {
        if (!event.data || event.data.source !== 'PAYSUPER_MANAGEMENT_SERVER') {
          return;
        }
        if (event.data.access_token && event.data.success) {
          this.setAccessToken(event.data.access_token);

          if (this.$route.query.redirect) {
            this.$router.push({ path: this.$route.query.redirect });
          } else {
            this.$router.push({ path: '/dashboard' });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  justify-content: center;
}

.iframe {
  margin-top: 20px;
}
</style>
