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
    <UiModal width="448px" :hasCloseButton="true" @close="$emit('close')">
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
          He or she must confirm your invitation to get access to your PaySuper account.
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

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 24px;
}

.controls {
  display: flex;
  justify-content: center;
}
</style>
