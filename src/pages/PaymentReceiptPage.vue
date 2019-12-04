<script>
import { mapState } from 'vuex';
import { includes } from 'lodash-es';
import SlideUpDown from 'vue-slide-up-down';
import PaymentReceiptStore from '@/store/PaymentReceiptStore';

export default {
  name: 'PaymentReceiptPage',

  components: {
    SlideUpDown,
  },

  async asyncData({ store, registerStoreModule, route }) {
    if (!includes(['purchase', 'refund'], route.params.receiptType)) {
      store.dispatch('setPageError', 404);
      return;
    }
    try {
      await registerStoreModule('PaymentReceipt', PaymentReceiptStore, {
        receiptType: route.params.receiptType,
        receiptId: route.params.receiptId,
        orderId: route.params.orderId,
      });
      // The refund receipt should be unavailable if order is not refunded
      if (
        route.params.receiptType === 'refund'
        && store.state.PaymentReceipt.receipt.order_type !== 'refund'
      ) {
        store.dispatch('setPageError', 404);
      }
    } catch (error) {
      store.dispatch('setPageError', error);
    }
  },

  data() {
    return {
      isAdditionalInfoExpanded: false,
    };
  },

  computed: {
    ...mapState('PaymentReceipt', ['receipt', 'receiptType']),

    isRefunded() {
      return this.receiptType === 'refund';
    },
  },
};
</script>

<template>
<div class="payment-receipt-page">
  <div class="window">
    <header class="header">
      <template v-if="isRefunded">
        <span class="status-icon-holder">
          <span class="status-icon _refund">
            <IconTurnBack />
          </span>
        </span>
        <h2>The purchase was refunded</h2>
        <p>Upon your request, we have issued a refund for this purchase.</p>
      </template>
      <template v-else>
        <span class="status-icon-holder">
          <span class="status-icon _success">
            <IconCheck
              width="14"
              height="12"
              stroke="#fff"
              stroke-width="1.8"
            />
          </span>
        </span>
        <h2>Thanks for the purchase</h2>
        <p>The transaction was successful, enjoy the game!</p>
      </template>
    </header>
    <div class="decoration-row">
      <span class="corner _top-left"></span>
      <span class="decoration-body _top"></span>
      <span class="corner _top-right"></span>
    </div>
    <div class="decoration-row">
      <span class="corner _bottom-left"></span>
      <span class="decoration-body _bottom"></span>
      <span class="corner _bottom-right"></span>
    </div>
    <div class="content">
      <h1 class="game-title">
        {{ receipt.project_name }}
      </h1>

      <div class="billing-row _total">
        <span class="billing-name">Total:</span>
        <span class="billing-value" v-if="!isRefunded">{{ receipt.total_price }}</span>
      </div>
      <div
        class="billing-row"
        v-for="(item, index) in receipt.items"
        :key="index"
      >
        <span class="billing-name">
          {{ item.name }}
        </span>
        <span class="billing-value _refund" v-if="isRefunded">
          Refund
        </span>
        <span class="billing-value" v-else>
          {{ item.price }}
        </span>
      </div>

      <div class="additional-toggler">
        <a
          href="#"
          @click.prevent="isAdditionalInfoExpanded = !isAdditionalInfoExpanded"
        >Additional Info</a>
        <UiOpenerCorner
          colorClosed="gray-blue"
          colorOpened="gray-blue"
          :isOpened="isAdditionalInfoExpanded"
        />
      </div>

      <SlideUpDown :active="isAdditionalInfoExpanded" :duration="300">
        <div class="billing-row">
          <span class="billing-name">Transaction date</span>
          <span class="billing-value">
            {{ receipt.transaction_date }}
          </span>
        </div>
        <div class="billing-row">
          <span class="billing-name">Transaction ID</span>
          <span class="billing-value">
            {{ receipt.transaction_id }}
          </span>
        </div>
        <div class="billing-row">
          <span class="billing-name">Merchant name</span>
          <span class="billing-value">
            {{ receipt.merchant_name }}
          </span>
        </div>
        <div class="billing-row" v-if="receipt.platform_name">
          <span class="billing-name">DRM platform</span>
          <span class="billing-value">
            {{ receipt.platform_name }}
          </span>
        </div>
        <div class="billing-row" v-if="receipt.payment_partner">
          <span class="billing-name">Payment partner</span>
          <span class="billing-value">
            {{ receipt.payment_partner }}
          </span>
        </div>
      </SlideUpDown>

      <div class="footer">
        <p>The receipt was sent to example@gmail.com</p>
        <div class="footer-links">
          <a href="https://pay.super.com/">PaySuper</a>
          <a href="https://pay.super.com/policy/tou/">Terms of Use</a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500,700");
@mixin corner($color, $offsetX, $offsetY) {
  background: $color;
  background: radial-gradient(
    circle 1px at $offsetX $offsetY,
    transparent,
    transparent 10px,
    $color 10.5px
  );
}

.payment-receipt-page {
  background: linear-gradient(90deg, #e1e4eb 0%, #e9ecf0 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Quicksand;
  padding: 48px 16px 32px;
  box-sizing: border-box;

  a {
    color: #5b88de;
    text-decoration: none;
  }
}
.window {
  max-width: 640px;
  width: 1000px; // IE11 fix
  flex-grow: 1;
}
.header {
  background: #f7f8fa;
  height: 100px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px 16px 0;
  position: relative;

  h2 {
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    color: #1a1a1a;
    margin: 0 0 8px;
  }

  p {
    font-family: Quicksand;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: #1a1a1a;
    margin: 0;
  }
}
.status-icon-holder {
  width: 56px;
  height: 56px;
  position: absolute;
  background: #f7f8fa;
  border-radius: 50%;
  top: -28px;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &._success {
    background: #2bd982;
  }

  &._refund {
    background: #fa7f56;
  }
}
.content {
  background: #fff;
  padding: 20px 32px 32px;
  border-radius: 0 0 8px 8px;
}
.game-title {
  font-family: Quicksand;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #1a1a1a;
  margin: 0;
}

.billing-row {
  font-size: 16px;
  line-height: 24px;
  color: #1a1a1a;
  display: flex;
  justify-content: space-between;
  padding: 10px 0 10px;
  border-bottom: 1px dashed #ebedf0;

  &._total {
    font-weight: 700;
    border-bottom: 1px solid #1a1a1a;
  }
}

.billing-name {
  padding-right: 16px;
}
.billing-value {
  text-align: right;

  &._refund {
    color: #fa7f56;
  }
}

.additional-toggler {
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
  padding: 11px 0 0px;
}

.footer {
  text-align: center;
  padding: 24px 32px 0px;
  font-size: 14px;
  line-height: 22px;

  p {
    margin: 0 0 8px;
  }
}

.footer-links {
  a {
    margin: 0 6px;
  }
}

.decoration-row {
  display: flex;
  align-items: center;
}
.decoration-body {
  height: 11px;
  flex-grow: 1;

  &._top {
    background: #f7f8fa;
  }

  &._bottom {
    background: #ffffff;
  }
}
.corner {
  width: 11px;
  height: 11px;
  background-repeat: no-repeat;

  &._top-left {
    @include corner(#f7f8fa, 0px, 11px);
  }
  &._top-right {
    @include corner(#f7f8fa, 11px, 11px);
  }
  &._bottom-left {
    @include corner(#ffffff, 0px, 0px);
  }
  &._bottom-right {
    @include corner(#ffffff, 11px, 0px);
  }
}

.slide-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
