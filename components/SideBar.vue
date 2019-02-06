<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav">
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/dashboard" active-class="active">
            <i class="nav-icon fa fa-tachometer"></i> Dashboard
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/merchant" active-class="active">
            <i class="nav-icon fa fa-file-text"></i> Merchant
          </nuxt-link>
        </li>
        <li class="nav-item" v-if="getMerchant && getMerchant.status >= 1">
          <nuxt-link class="nav-link" to="/project" active-class="active">
            <i class="nav-icon fa fa-cog"></i> Projects
          </nuxt-link>
        </li>
        <li class="nav-item" v-if="getMerchant && getMerchant.status >= 1">
          <nuxt-link class="nav-link" to="/order" active-class="active">
            <i class="nav-icon fa fa-cog"></i> Orders
          </nuxt-link>
        </li>
        <li class="nav-item" v-if="getMerchant && getMerchant.status >= 1">
          <nuxt-link class="nav-link" to="/revenue" active-class="active">
            <i class="nav-icon fa fa-cog"></i> Revenue
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      getMerchant: 'merchant/getMerchant',
    }),
  },
};
</script>
