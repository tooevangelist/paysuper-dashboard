<template>
  <div id="login">
    <div class="login-card">
      <div class="card-title">
        <h1>Sign In to PONEPay</h1>
      </div>

      <social-networks></social-networks>

      <div class="content">
        <form method="POST" action="#">
          <input id="email" placeholder="Email" required autofocus v-model="data.email">
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
                <input type="checkbox" class="form-check-input" id="checkbox">
                <label class="form-check-label" for="checkbox">Remember me</label>
              </div>
            </div>

            <div class="col text-right align-top">
              <a href="#">Forgot Password?</a>
            </div>
          </div>

          <button type="submit" @click.prevent="signIn">Sign In</button>

          <div class="row switch-container">
            <div class="col text-center">
              <span>No account yet?</span>
              <router-link to="/register">Sign Up</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SocialNetworks from './SocialNetworks.vue';
import Notifications from '../mixins/notificaton';
import Auth from '../mixins/auth';

export default {
  components: { SocialNetworks },
  mixins: [Notifications, Auth],
  data() {
    return {
      data: { email: '', password: '' },
    };
  },
  methods: {
    signIn() {
      if (this.data.email === '' || this.data.password === '') {
        return;
      }

      const self = this;

      this.$store.dispatch('login', this.data)
        .then((response) => {
          if (!response.data || !response.data.accessToken || !response.data.refreshToken) {
            return;
          }

          const data = {
            data: response.data,
            email: self.data.email,
          };

          self.setCookies(data);
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

      this.$store.dispatch('merchant/get')
        .then((response) => {
          if (response.data.status >= 1) {
            self.$router.push('/dashboard');
          } else {
            self.$router.push('/merchant');
          }
        });
    },
  },
  computed: {
    ...mapGetters(['getUser']),
  },
};
</script>

<style lang="scss">
@import "../assets/scss/_forms.scss";
</style>
