<template>
  <div id="login">
    <div class="login-card">
      <div class="card-title">
        <h1>Sign Up to PONEPay</h1>
      </div>

      <social-networks></social-networks>

      <div class="content">
        <form method="POST" action="#">
          <input
            id="email"
            type="email"
            placeholder="Email"
            required
            autofocus
            v-model="data.email"
          >
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            v-model="data.password"
          >

          <div class="row">
            <div class="col">
              <div class="form-group form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="checkbox"
                  v-model="data.readEula"
                >
                <label class="form-check-label" for="checkbox">I have read and agreed to the
                  <nuxt-link to="/eula" target="_blank">EULA</nuxt-link>and
                  <nuxt-link to="/privacy_policy" target="_blank">Privacy Policy</nuxt-link>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" @click.prevent="signUp">Sign Up</button>

          <div class="row switch-container">
            <div class="col text-center">
              <span>Already have an account?</span>
              <nuxt-link to="/login">Sign In</nuxt-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Notifications from '../mixins/notificaton';
import SocialNetworks from './SocialNetworks.vue';
import Auth from '../mixins/auth';

export default {
  middleware: 'IsAuthenticated',
  components: { SocialNetworks },
  mixins: [Notifications, Auth],
  data() {
    return {
      data: { email: '', password: '', readEula: false },
    };
  },
  methods: {
    signUp() {
      if (this.data.email === '' || this.data.password === '' || this.data.readEula !== true) {
        return;
      }

      const self = this;

      this.$store.dispatch('register', this.data)
        .then((response) => {
          if (!response.data || !response.data.accessToken || !response.data.refreshToken) {
            return;
          }

          const data = {
            data: response.data,
            email: self.data.email,
          };

          self.setCookies(data);
          self.success('Registration complete successfully');
        }).catch((e) => {
          self.error(self.getErrorMessage(e));
        });
    },
  },
  watch: {
    getUser(data) {
      if (!data.accessToken || !data.email) {
        return;
      }

      const self = this;

      this.$store.dispatch('merchant/create')
        .then(() => {
          self.$router.push('/merchant');
        });
    },
  },
  computed: {
    ...mapGetters(['getUser']),
  },
};
</script>

<style lang="scss">
@import "assets/scss/_forms.scss";
</style>
