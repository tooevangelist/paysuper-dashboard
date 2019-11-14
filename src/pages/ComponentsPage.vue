<script>
import PictureProfileAndPeople from '@/components/PictureProfileAndPeople.vue';

export default {
  name: 'ComponentsPage',

  components: {
    PictureProfileAndPeople,
  },
};
</script>

<template>
<div>
  <UiRadio :disabled="true" :checked="true">fff</UiRadio>
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
        UiTableCellUnit
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
            <UiTableCell align="left">
              <UiTableCellUnit>13.03.2019</UiTableCellUnit>
              <UiTableCellUnit>11.03.2019</UiTableCellUnit>
              <UiTableCellUnit>09.03.2019</UiTableCellUnit>
            </UiTableCell>
            <UiTableCell align="left">
              <UiTableCellUnit>Inactive</UiTableCellUnit>
              <UiTableCellUnit>Inactive</UiTableCellUnit>
              <UiTableCellUnit>Inactive</UiTableCellUnit>
            </UiTableCell>
          </UiTableRow>
        </UiTable>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiComplexTable<br>
        UiComplexTableRow<br>
        UiComplexTableCell<br>
      </td>
      <td class="cell">
        <UiComplexTable>
          <UiComplexTableRow :isHead="true">
            <UiComplexTableCell align="left">Company</UiComplexTableCell>
            <UiComplexTableCell align="left">Last change</UiComplexTableCell>
            <UiComplexTableCell align="left">Value (editable)</UiComplexTableCell>
          </UiComplexTableRow>
          <UiComplexTableRow>
            <UiComplexTableCell align="left">Roga i copita</UiComplexTableCell>
            <UiComplexTableCell align="left">29.10.2009</UiComplexTableCell>
            <UiComplexTableCell align="left" :isEditable="true">123</UiComplexTableCell>
          </UiComplexTableRow>
          <UiComplexTableRow :isPainted="true">
            <UiComplexTableCell align="left">Moya bashenka</UiComplexTableCell>
            <UiComplexTableCell align="left">13.03.2019</UiComplexTableCell>
            <UiComplexTableCell align="left" :isEditable="true">321</UiComplexTableCell>
          </UiComplexTableRow>
        </UiComplexTable>
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
    <tr>
      <td class="cell">
        UiDotsMenuTrigger
      </td>
      <td class="cell">
        <UiDotsMenuTrigger />
        <UiDotsMenuTrigger :isOpened="true" />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiNoText
      </td>
      <td class="cell">
        <UiNoText />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiTooltipMenuItem
      </td>
      <td class="cell">
        <UiTooltipMenuItem>Enable</UiTooltipMenuItem>
        <UiTooltipMenuItem>Disable</UiTooltipMenuItem>
        <UiTooltipMenuItem iconComponent="IconDeactivate">Deactivate</UiTooltipMenuItem>
        <UiTooltipMenuItem iconComponent="IconDelete" type="delete">Delete</UiTooltipMenuItem>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiFilterAgreementStatus
      </td>
      <td class="cell">
        <UiFilterAgreementStatus />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiFilterDate
      </td>
      <td class="cell">
        <UiFilterDate />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiFilterSearchInput
      </td>
      <td class="cell">
        <UiFilterSearchInput />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiPageHeaderFrame
      </td>
      <td class="cell">
        <UiPageHeaderFrame>
          <span slot="title">Personal Profile</span>
          <span slot="description">
            Initial onboarding information from merchant about his business
            and goals to understand how can we help him exactly.
          </span>
          <PictureProfileAndPeople slot="picture" />
        </UiPageHeaderFrame>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiOpenerCorner
      </td>
      <td class="cell">
        <UiOpenerCorner />
        <UiOpenerCorner :isOpened="true" />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiUploadControls
      </td>
      <td class="cell">
        <UiUploadControls />
        <br>
        <UiUploadControls :isFilled="true" />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiImageUpload
      </td>
      <td class="cell">
        <UiImageUpload :value="''" :uploadImage="() => {}" />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiLangsImageUpload
      </td>
      <td class="cell">
        <UiLangsImageUpload
          :value="{en: '', ru: ''}"
          :uploadImage="() => {}"
          :isLocalizationOpened="true"
        />
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiSuggestItem
      </td>
      <td class="cell">
        <UiSuggestItem>Lalalley topoley</UiSuggestItem>
        <UiSuggestItem>Mama ama criminal</UiSuggestItem>
      </td>
    </tr>
    <tr>
      <td class="cell">
        UiTabs
      </td>
      <td class="cell">
        <UiTabs />
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
