<script>
export default {
  name: 'ComponentsPage',
};
</script>

<template>
<div>
  <table class="table">
    <tr>
      <td class="cell">
        UiHeader
      </td>
      <td class="cell">
        <UiHeader level="2" :hasMargin="true">Header sample</UiHeader>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiButton
      </td>
      <td class="cell">
        <UiButton>Click me</UiButton>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiCheckbox
      </td>
      <td class="cell">
        <UiCheckbox>Click me</UiCheckbox>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiRadio
      </td>
      <td class="cell">
        <UiRadio>Click me</UiRadio>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiSwitchBox
      </td>
      <td class="cell">
        <UiSwitchBox>Click me</UiSwitchBox>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiSelect
      </td>
      <td class="cell">
        <UiSelect
          label="Example"
          :options="[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]"
        />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiTextField
      </td>
      <td class="cell">
        <UiTextField label="Example" value="some value" />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiTextFieldReadonly
      </td>
      <td class="cell">
        <UiTextFieldReadonly label="Example" value="<a href='#'>http://ya.ru</a>"/>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiLangsMainHub
      </td>
      <td class="cell">
        <UiLangsMainHub />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiLangTextField
      </td>
      <td class="cell">
        <UiLangTextField label="Example" :value="{en: 'Lala', ru: ''}" />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiPanel
      </td>
      <td class="cell">
        <UiPanel>
          My content
        </UiPanel>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiProgressRing
      </td>
      <td class="cell">
        <UiProgressRing :currentStep="5" />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiText
      </td>
      <td class="cell">
        <UiText>
          Long long text here long long text here long long text here long long text here
          long long text here long long text here long long text here long long text here
          long long text here long long text here
        </UiText>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiScrollbarBox
      </td>
      <td class="cell">
        <UiScrollbarBox style="max-height: 100px">
          Text<br>
          Text<br>
          Text<br>
          Text<br>
          Text<br>
          Text<br>
          Text<br>
          Text<br>
          Text<br>
          Text<br>
          Text<br>
        </UiScrollbarBox>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiTip
      </td>
      <td class="cell">
        <div style="height: 140px;">
          <div style="position: relative;">
            <UiTip :visible="true" position="bottom">
              Text text text<br>
              Text<br>
              Text<br>
              Text<br>
              Text<br>
            </UiTip>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiTable<br>
        UiTableRow<br>
        UiTableCell<br>
      </td>
      <td class="cell">
        <UiTable>
          <UiTableRow :isHead="true">
            <UiTableCell align="left">Company</UiTableCell>
            <UiTableCell align="left">Last change</UiTableCell>
            <UiTableCell align="left">Status</UiTableCell>
          </UiTableRow>
          <UiTableRow>
            <UiTableCell align="left">Roga i copita</UiTableCell>
            <UiTableCell align="left">29.10.2009</UiTableCell>
            <UiTableCell align="left">Active</UiTableCell>
          </UiTableRow>
          <UiTableRow>
            <UiTableCell align="left">Moya bashenka</UiTableCell>
            <UiTableCell align="left">13.03.2019</UiTableCell>
            <UiTableCell align="left">Inactive</UiTableCell>
          </UiTableRow>
        </UiTable>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiLabelTag
      </td>
      <td class="cell">
        <UiLabelTag color="green">Active</UiLabelTag>
        <UiLabelTag color="transparent">Inactive</UiLabelTag>
      </td>
    </tr>
  </table>
</div>
</template>

<style lang="scss" scoped>
.table {
  border-collapse: collapse;
}

.cell {
  padding: 10px 15px;
  border: 1px solid #ccc;
}
</style>
