<template>
  <ul class="social-list-btns">
    <li v-for="item in socialNetworks" v-bind:key="item.name">
      <a v-bind:href="item.url" v-bind:class="item.name">
        <i v-bind:class="'fa ' + item.icon"></i>
      </a>
    </li>
  </ul>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      socialNetworks: [],
    };
  },
  async mounted() {
    const { data } = await axios.get(`${process.env.authServerUrl}/oauth/sources/`);

    for (let i = 0; i < data.length; i++) {
      if (process.env.socialNetworks[data[i].name] !== true) {
        // eslint-disable-next-line
        continue;
      }

      data[i].url = process.env.authServerUrl + data[i].url;
      data[i].icon = process.env.socialNetworks[data[i].name].icon;
    }

    this.socialNetworks = data;
  },
};
</script>

<style lang="scss">
$white: #ffffff;
$facebookColor: #517093;
$vkontakteColor: #517194;
$odnoklassnikiColor: #ee8208;

ul.social-list-btns {
  margin: 1.25em 0 0 0 !important;
  padding: 4px;
  text-align: center;
  li {
    display: inline;
    margin-right: 5px;
    a {
      border: 0;
      border-radius: 100%;
      display: inline-block;
      text-align: center;
      text-decoration: none;
      width: 5.75em;
      height: 5.75em;
      i {
        font-size: 3em;
        line-height: 1.8em;
      }
    }
    a.facebook {
      color: $facebookColor;
      border: 2px solid $facebookColor;
      &:hover {
        color: $white;
        background-color: $facebookColor;
      }
      &:active,
      &:focus {
        color: $facebookColor;
        border-color: $facebookColor;
      }
    }
    a.vkontakte {
      color: $vkontakteColor;
      border: 2px solid $vkontakteColor;
      &:hover {
        color: $white;
        background-color: $vkontakteColor;
      }
      &:active,
      &:focus {
        color: $vkontakteColor;
        border-color: $vkontakteColor;
      }
    }
    a.odnoklassniki {
      color: $odnoklassnikiColor;
      border: 2px solid $odnoklassnikiColor;
      &:hover {
        color: $white;
        background-color: $odnoklassnikiColor;
      }
      &:active,
      &:focus {
        color: $odnoklassnikiColor;
        border-color: $odnoklassnikiColor;
      }
    }
  }
}
</style>
