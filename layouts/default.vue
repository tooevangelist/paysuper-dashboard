<template>
  <div class="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show">
    <header-navbar></header-navbar>

    <div class="app-body">
      <side-bar></side-bar>

      <main class="main">
        <breadcrumb></breadcrumb>

        <div class="container-fluid">
          <div class="animated fadeIn">
            <div class="row">
              <nuxt/>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import HeaderNavbar from '../components/HeaderNavbar';
  import SideBar from '../components/SideBar';
  import Breadcrumb from '../components/Breadcrumb';

  export default {
      components: {HeaderNavbar, SideBar, Breadcrumb}
  }
</script>

