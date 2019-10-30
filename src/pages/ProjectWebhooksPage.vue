<script>
import PictureDotsAndSquaresScheme from '@/components/PictureDotsAndSquaresScheme.vue';

export default {
  name: 'ProjectWebhooksPage',

  components: {
    PictureDotsAndSquaresScheme,
  },

  methods: {
    configure(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<template>
<div>
  <UiPageHeaderFrame>
    <template slot="title">
      Webhooks
    </template>
    <template slot="description">
      In this section we will setup and test two-way notifications between our systems,
      so all orders and commands would work as intended.
      This is an obligatory requirement for Virtual Currency and Virtual Items sales options.
    </template>
    <PictureDotsAndSquaresScheme slot="picture" />
  </UiPageHeaderFrame>

  <UiPanel>
    <section class="section">
      <div>
        <UiHeader
          :hasMargin="true"
          level="3"
        >
          Virtual currency
        </UiHeader>
        <UiText class="text">
          Virtual Currency is an option to sell your in-game currency —
          <b>gold, coins, etc.</b>
        </UiText>
      </div>
      <div class="section-aside">
        <UiButton
          class="button"
          @click="configure('ProjectVirtualCurrency')"
        >
          CONFIGURE
        </UiButton>
      </div>
    </section>
  </UiPanel>

  <UiPanel>
    <section class="section">
      <div>
        <UiHeader
          :hasMargin="true"
          level="3"
        >
          Virtual items
        </UiHeader>
        <UiText class="text">
          This sales option will allow you to sell your Virtual Items, like
          <b>swords, guns, helmets</b> and virtual currency packs.
        </UiText>
      </div>
      <div class="section-aside">
        <UiButton
          class="button"
          @click="configure('ProjectVirtualItems')"
        >
          CONFIGURE
        </UiButton>
      </div>
    </section>
  </UiPanel>
</div>
</template>


<style lang="scss" scoped>
.section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.text {
  max-width: 400px;
}

.section-aside {
  display: flex;
  align-items: center;
}

.tag {
  margin-left: 8px;
}
</style>
