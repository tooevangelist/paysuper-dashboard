<template>
<div class="file-download">
  <a class="download-link" :href="url">
    <span class="icon">
      <svg width="31" height="40" viewBox="0 0 31 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.5 0.5H19.7929L27.5 8.20711V39.5H0.5V0.5Z" fill="white" stroke="#B1B1B1"/>
      <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="7"
      y="16" width="21" height="16">
      <rect x="7" y="16" width="21" height="16" fill="#783535"/>
      </mask>
      <g mask="url(#mask0)">
      <rect x="7" y="17" width="22" height="14" rx="2" fill="black" fill-opacity="0.15"/>
      </g>
      <rect x="9" y="15" width="22" height="14" rx="2" :fill="extensionColor"/>
      <g filter="url(#filter0_d)"></g>
      <defs>
        <filter
          id="filter0_d" x="12.3788" y="19.216" width="15.3271" height="6.784"
          filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
          <feOffset dy="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
      </defs>
      </svg>
      <span class="extension">{{extension}}</span>
    </span>
    <div class="description">
      <div class="name">{{name}}</div>
      <div class="size" v-if="size">{{size}}</div>
    </div>
    <UiButton>Download</UiButton>
  </a>
</div>
</template>

<script>
import { UiButton } from '@protocol-one/ui-kit';

export default {
  name: 'FileDownload',

  components: {
    UiButton,
  },

  props: {
    name: {
      required: true,
      type: String,
    },
    size: {
      type: String,
    },
    extension: {
      required: true,
      type: String,
    },
    url: {
      required: true,
      type: String,
    },
  },

  computed: {
    extensionColor() {
      if (this.extension.toLowerCase() === 'pdf') {
        return '#DA6464';
      }

      return '#ddd';
    },
  },
};
</script>

<style lang="scss" scoped>
.file-download {
}

.download-link {
  display: flex;
  text-decoration: none;
}

.icon {
  position: relative;
}

.extension {
  color: #fff;
  font-size: 9px;
  line-height: 12px;
  font-weight: bold;
  text-transform: uppercase;

  width: 22px;
  height: 14px;
  position: absolute;
  top: 16px;
  left: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.description {
  padding-left: 12px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  width: 430px;
}

.name {
  color: #333333;
  font-size: 16px;
}

.size {
  color: #b1b1b1;
  font-size: 14px;
}
</style>
