<template>
  <div>
    <iframe width="500" height="500" :src="iframeSrc" frameborder="1"></iframe>
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
    this.listenFrame();
  },

  methods: {
    ...mapActions('User', ['setAccessToken']),
    listenFrame() {
      window.addEventListener('message', (event) => {
        if (!event.data || event.data.source !== 'PAYSUPER_MANAGEMENT_SERVER') {
          return;
        }
        console.log(11111, 'event.data', event.data);
        if (event.data.access_token && event.data.success) {
          this.setToken(event.data.access_token);
          this.$router.push({ path: '/dashboard' });
        }
      });
    },
  },
};
</script>
