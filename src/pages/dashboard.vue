<script>
import { UiPageHeader, UiButton } from '@protocol-one/ui-kit';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    UiPageHeader,
    UiButton,
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

    <UiButton @click="setIsAdmin(true)" :disabled="isAdmin">I'm Admin</UiButton>
    <UiButton @click="setIsAdmin(false)" :disabled="!isAdmin">I'm Client</UiButton>
  </div>
</template>
