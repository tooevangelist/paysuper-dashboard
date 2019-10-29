<script>
import PictureMailSent from '@/components/PictureMailSent.vue';

export default {
  name: 'InviteUserSuccessModal',

  components: {
    PictureMailSent,
  },
};
</script>

<template>
  <div>
    <UiModal width="448px">
      <div class="content">
        <PictureMailSent></PictureMailSent>
        <UiHeader
          slot="header"
          level="3"
          align="center"
        >
          Invitation sent
        </UiHeader>
        <div class="descr">
          A letter was sent to invited user.
          He or she must confirm your invitation to get access to your Pay Super account.
        </div>
      </div>

      <div class="controls">
        <UiButton
          class="modal-button"
          color="gray"
          :isTransparent="true"
          @click="$emit('close')"
        >
          CLOSE
        </UiButton>
      </div>
    </UiModal>
  </div>
</template>

<style lang="scss" scoped></style>
