<script>
export default {
  name: 'PaymentReceiptPage',

  data() {
    return {
      items: [
        {
          amount: 27,
          currency: 'USD',
          name: 'BioShock: The Collection',
        },
        {
          amount: 16,
          currency: 'USD',
          name: 'Call of duty Ghosts',
        },
        {
          amount: 77.8,
          currency: 'USD',
          name: 'The Elder Scrolls5: Skyrim',
        },
      ],
    };
  },
};
</script>

<template>
<div class="payment-receipt-page">
  <div class="window">
    <header class="header">
      <span class="status-icon-holder">
        <span class="status-icon"></span>
      </span>
      <h2>Thanks for the purchase</h2>
      <p>The transaction was successful, enjoy the game!</p>
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
    <main class="content">
      <h1 class="game-title">
        World of Warships
      </h1>

      <div class="billing-row _total">
        <span class="billing-name">Total</span>
        <span class="billing-value">{{ $formatPrice(112, 'USD') }}</span>
      </div>
      <div
        class="billing-row"
        v-for="(item, index) in items"
        :key="index"
      >
        <span class="billing-name">
          {{ item.name }}
        </span>
        <span class="billing-value">
          {{ $formatPrice(item.amount, item.currency) }}
        </span>
      </div>
    </main>
  </div>
</div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500");
.payment-receipt-page {
  background: linear-gradient(90deg, #d3a9fc 0%, #4facfe 100%, #e7f3fe 100%);
  min-height: 100vh;
  display: flex;
  font-family: Quicksand;
}
.window {
  width: 640px;
  margin: auto;
}
.header {
  background: #f7f8fa;
  height: 100px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: 20px;
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
  background: #2bd982;
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
  align-items: center;
  height: 45px;
  border-bottom: 1px dashed #ebedf0;

  &._total {
    font-weight: bold;
  }
}

.billing-name {
}

.billing-value {
}

.decoration-row {
  display: flex;
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
    background: #f7f8fa;
    background: radial-gradient(
      circle 1px at 0px 11px,
      transparent,
      transparent 10px,
      #f7f8fa 10.5px
    );
  }
  &._top-right {
    background: #f7f8fa;
    background: radial-gradient(
      circle 1px at 11px 11px,
      transparent,
      transparent 10px,
      #f7f8fa 10.5px
    );
  }
  &._bottom-left {
    background: #ffffff;
    background: radial-gradient(
      circle 1px at 0px 0px,
      transparent,
      transparent 10px,
      #ffffff 10.5px
    );
  }
  &._bottom-right {
    background: #ffffff;
    background: radial-gradient(
      circle 1px at 11px 0px,
      transparent,
      transparent 10px,
      #ffffff 10.5px
    );
  }
}
</style>
