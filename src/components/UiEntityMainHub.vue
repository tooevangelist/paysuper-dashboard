<script>
export default {
  name: 'UiEntityMainHub',

  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    defaultOption: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
<div class="ui-entity-main-hub">
  <div class="title">{{ label }}</div>
  <div>
    <button
      class="add-button"
      @click="$emit('add')"
    >
      <IconPlus width="9" height="9" />
      <span>ADD</span>
    </button>
    <button
      class="entity-button"
      v-for="entity in value"
      :class="{ '_undeletable': entity === defaultOption }"
      :key="entity"
      @click="$emit('delete', entity)"
    >
      {{ entity }}
      <IconClose
        class="close-button"
      />
    </button>
  </div>
</div>
</template>

<style scoped lang="scss">
.ui-entity-main-hub {
  padding-top: 6px;
}

.title {
  font-size: 12px;
  line-height: 16px;
  color: #5e6366;
  padding-left: 12px;
  margin-bottom: 8px;
}

.add-button,
.entity-button {
  position: relative;
  border-radius: 14px;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  height: 28px;
  line-height: 28px;
  text-transform: uppercase;
  display: inline-flex;
  transition: background-color 0.2s ease-out, color 0.2s ease-out;
  border: 0;
  margin-bottom: 2px;

  & + & {
    margin-left: 2px;
  }
}

.add-button {
  padding: 0 14px 0 12px;
  background-color: #3d7bf5;
  color: #fff;
  align-items: baseline;

  &:hover {
    background-color: rgba(#3d7bf5, 0.85);
  }

  & > svg {
    margin-right: 3px;
  }
}

.entity-button {
  padding: 0 20px;
  background-color: #f7f9fa;

  &:not(._undeletable):hover {
    color: #ea3d2f;
    background-color: rgba(#ea3d2f, 0.1);

    .close-button {
      stroke: #ea3d2f;
    }
  }

  &._undeletable {
    cursor: default;

    .close-button {
      display: none;
    }
  }
}

.close-button {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 7px;
  height: 7px;
  stroke: #919699;
}
</style>
