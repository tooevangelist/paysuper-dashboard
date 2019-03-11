<script>
import Notifications from '@/mixins/notificaton';

export default {
  mixins: [Notifications],
  mounted() {
    const recaptchaScript = document.createElement('script');
    recaptchaScript.setAttribute('src', 'https://static.protocol.one/paysuper/sdk/dev/paysuper.js');
    document.head.appendChild(recaptchaScript);
  },
  methods: {
    buy(amount, currency) {
      const { PaySuper } = window;
      this.$nextTick(() => {
        const paySuper = new PaySuper({
          projectID: process.env.VUE_APP_P1PAYAPI_PROJECT_IDENTIFIER,
          region: 'US',
          // account: 'dmitriy.sinichkin@protocol.one',
        });
        paySuper.setCurrency(currency).setAmount(amount).renderModal();
      });
    },
  },
};
</script>

<template>
  <div class="demo-page-container">
    <div
      class="demo-page-header d-flex flex-column flex-md-row
      align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm"
    >
      <h5 class="my-0 mr-md-auto font-weight-normal">Universe of Futurama</h5>
      <nav class="my-2 my-md-0 mr-md-3">
        <a class="p-2 text-dark" href="#mounts">Mounts</a>
        <a class="p-2 text-dark" href="#pets">Pets</a>
      </nav>
    </div>

    <!-- Ездовые животные -->
    <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
      <h1 id="mounts" class="display-4">Mounts</h1>
      <p class="lead">
        The new mount will help you get faster to anywhere in the world,
        as well as act as a reliable ally in
        any battle.
      </p>
    </div>

    <div class="container">
      <div class="card-deck mb-3 text-center">
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Scooty-Puff Junior</h4>
          </div>
          <div class="image scooty-puff-jr"></div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">$5</h1>
            <ul class="list-unstyled mt-3 mb-4">
              <li>
                <strong>Level:</strong> 1
              </li>
              <li>
                <strong>Combat:</strong> 0
              </li>
              <li>
                <strong>Speed:</strong> +20
              </li>
              <li>
                <strong>Health:</strong> 289
              </li>
            </ul>
            <button
              type="button"
              class="btn btn-lg btn-block btn-outline-primary"
              @click="buy(5, 'USD')"
            >Buy</button>
          </div>
        </div>
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Scooty Puff</h4>
          </div>
          <div class="image scooty-puff"></div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">$10</h1>
            <ul class="list-unstyled mt-3 mb-4">
              <li>
                <strong>Level:</strong> 5
              </li>
              <li>
                <strong>Combat:</strong> 3
              </li>
              <li>
                <strong>Speed:</strong> +40
              </li>
              <li>
                <strong>Health:</strong> 1343
              </li>
            </ul>
            <button
              type="button"
              class="btn btn-lg btn-block btn-success"
              @click="buy(10, 'USD')"
            >Buy</button>
          </div>
        </div>
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Planet Express</h4>
          </div>
          <div class="image planet-express"></div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">$20</h1>
            <ul class="list-unstyled mt-3 mb-4">
              <li>
                <strong>Level:</strong> 10
              </li>
              <li>
                <strong>Combat:</strong> 9
              </li>
              <li>
                <strong>Speed:</strong> +80
              </li>
              <li>
                <strong>Health:</strong> 3751
              </li>
            </ul>
            <button
              type="button"
              class="btn btn-lg btn-block btn-outline-primary"
              @click="buy(20, 'USD')"
            >Buy</button>
          </div>
        </div>
      </div>

      <!-- Питомцы -->
      <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 id="pets" class="display-4">Pets</h1>
        <p class="lead">
          The pet will not only give you his warmth and affection,
          but also bestow his unique ones, both in
          battle and in everyday affairs.
        </p>
      </div>

      <div class="container">
        <div class="card-deck mb-3 text-center">
          <div class="card mb-4 shadow-sm">
            <div class="card-header">
              <h4 class="my-0 font-weight-normal">Nibbler</h4>
            </div>
            <div class="image nibbler"></div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">$10</h1>
              <ul class="list-unstyled mt-3 mb-4">
                <li>
                  <strong>Health:</strong> 283
                </li>
                <li>
                  <strong>Eats feed:</strong> 12
                </li>
                <li>
                  <strong>Skills:</strong> Create dark matter, Can eat enemy
                </li>
              </ul>
              <button
                type="button"
                class="btn btn-lg btn-block btn-outline-primary"
                @click="buy(10, 'USD')"
              >Buy</button>
            </div>
          </div>
          <div class="card mb-4 shadow-sm">
            <div class="card-header">
              <h4 class="my-0 font-weight-normal">Dr. John A. Zoidberg</h4>
            </div>
            <div class="image zoidberg"></div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">$20</h1>
              <ul class="list-unstyled mt-3 mb-4">
                <li>
                  <strong>Health:</strong> 567
                </li>
                <li>
                  <strong>Eats feed:</strong> 24
                </li>
                <li>
                  <strong>Skills:</strong> Healing, Claw, Ink stain
                </li>
              </ul>
              <button
                type="button"
                class="btn btn-lg btn-block btn-outline-primary"
                @click="buy(20, 'USD')"
              >Buy</button>
            </div>
          </div>
          <div class="card mb-4 shadow-sm">
            <div class="card-header">
              <h4 class="my-0 font-weight-normal">Double Yeti</h4>
            </div>
            <div class="image double-yeti"></div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">$50</h1>
              <ul class="list-unstyled mt-3 mb-4">
                <li>
                  <strong>Health:</strong> 1429
                </li>
                <li>
                  <strong>Eats feed:</strong> 61
                </li>
                <li>
                  <strong>Skills:</strong> Scream, Horn, Armor, Poison
                </li>
              </ul>
              <button
                type="button"
                class="btn btn-lg btn-block btn-success"
                @click="buy(50, 'USD')"
              >Buy</button>
            </div>
          </div>
        </div>
      </div>

      <footer class="pt-4 my-md-5 pt-md-5 border-top">
        <div class="row"></div>
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
.image {
  margin: 10px;
  padding: 5px;
  border: 1px solid #c8ced3;
  height: 210px;
  width: auto;

  &.scooty-puff-jr {
    background: url("../assets/images/scooty-puff-jr.jpg") no-repeat transparent
      center center;
  }
  &.scooty-puff {
    background: url("../assets/images/scooty-puff.jpg") no-repeat transparent
      center center;
    background-size: cover;
  }
  &.planet-express {
    background: url("../assets/images/planet-express.jpg") no-repeat transparent
      center center;
    background-size: cover;
  }
  &.nibbler {
    background: url("../assets/images/nibbler.jpg") no-repeat transparent center
      center;
    background-size: contain;
  }
  &.zoidberg {
    background: url("../assets/images/zoidberg.jpg") no-repeat transparent
      center center;
    background-size: cover;
  }
  &.double-yeti {
    background: url("../assets/images/double-yeti.jpg") no-repeat transparent
      center center;
    background-size: cover;
  }
}
</style>
