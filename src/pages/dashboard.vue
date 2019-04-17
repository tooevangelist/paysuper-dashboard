<script>
import {
  UiPageHeader,
  UiButton,
  UiHeader,
  UiModal,
} from '@protocol-one/ui-kit';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    UiPageHeader,
    UiButton,
    UiHeader,
    UiModal,
  },

  computed: {
    ...mapState('User', ['isAdmin']),
  },

  methods: {
    ...mapMutations('User', { setIsAdmin: 'isAdmin' }),
  },
};
</script>

<template>
  <div>
    <UiPageHeader>
      <span slot="title">Dashboard</span>
    </UiPageHeader>

    <!-- <UiButton @click="setIsAdmin(true)" :disabled="isAdmin">I'm Admin</UiButton>
    <UiButton @click="setIsAdmin(false)" :disabled="!isAdmin">I'm Client</UiButton> -->

    <UiModal>
      <div class="dialog" slot="main">
        <UiHeader level="2" :hasMargin="true">There should be a dashboard</UiHeader>
        <p>
          Welcome!
        </p>
        <p>
          Now you could try
          <router-link to="/projects/new">setting up a project</router-link> in a test environment.
          But such functions as accepting real payments,
          viewing dashboards and reports will become available only after signing an agreement.
          Please take the time to
          <router-link to="/company">fill out company information</router-link>
          and sign an agreement..
        </p>
        <div class="dialog__controls">
          <router-link to="/projects">
            <UiButton>Go to projects</UiButton>
          </router-link>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  width: 450px;
  font-size: 16px;
  color: #b1b1b1;

  p {
    margin-bottom: 10px;
  }

  &__controls {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
