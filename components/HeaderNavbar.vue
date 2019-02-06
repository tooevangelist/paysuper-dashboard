<template>
  <header class="app-header navbar">
    <button
      class="navbar-toggler sidebar-toggler d-lg-none mr-auto"
      type="button"
      data-toggle="sidebar-show"
    >
      <span class="navbar-toggler-icon"/>
    </button>
    <a class="navbar-brand" href="#">P1 Payments</a>
    <button
      class="navbar-toggler sidebar-toggler d-md-down-none"
      type="button"
      data-toggle="sidebar-lg-show"
    >
      <span class="navbar-toggler-icon"/>
    </button>
    <ul class="nav navbar-nav d-md-down-none">
      <li class="nav-item px-3">
        <a class="nav-link" href="#">Dashboard</a>
      </li>
      <li class="nav-item px-3">
        <a class="nav-link" href="#">Users</a>
      </li>
      <li class="nav-item px-3">
        <a class="nav-link" href="#">Settings</a>
      </li>
    </ul>
    <ul class="nav navbar-nav ml-auto">
      <li class="nav-item d-md-down-none">
        <a class="nav-link" href="#">
          <i class="fa fa-bell-o"/>
          <span class="badge badge-pill badge-danger">5</span>
        </a>
      </li>
      <li class="nav-item d-md-down-none">
        <a class="nav-link" href="#">
          <i class="fa fa-list-ul"/>
          <span class="badge badge-pill badge-warning">10+</span>
        </a>
      </li>
    </ul>

    <button
      class="navbar-toggler aside-menu-toggler d-md-down-none"
      type="button"
      data-toggle="aside-menu-lg-show"
    >
      <span class="fa fa-sign-out"/>
    </button>
  </header>
</template>
