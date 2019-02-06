<template>
  <div class="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show">
    <header-navbar></header-navbar>

    <div class="app-body">
      <side-bar></side-bar>

      <main class="main">
        <breadcrumb></breadcrumb>

        <div class="container-fluid">
          <div class="animated fadeIn">
            <div class="row bg-white">
              <nuxt/>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import HeaderNavbar from '../components/HeaderNavbar.vue';
import SideBar from '../components/SideBar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';

export default {
  components: { HeaderNavbar, SideBar, Breadcrumb },
};
</script>

