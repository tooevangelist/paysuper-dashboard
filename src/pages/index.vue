<script>
export default {
  methods: {
    goAuthoriseOrRegister() {
      this.$router.push({ name: 'Login', query: { redirect: this.$route.query.redirect } });
    },
  },
};
</script>

<template>
  <div class="auth-board">
    <IconComputer />
    <span
      v-html="$t('title')"
      class="title"
    />
    <span
      class="text"
      v-html="$t('text')"
    />
    <UiButton
      class="button"
      :text="$t('buttonText')"
      @click="goAuthoriseOrRegister"
    />
  </div>
</template>

 <style lang="scss" scoped>
.auth-board {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #b1b1b1;
  flex: 1;
  padding-bottom: 50px;
}
.title {
  font-family: Quicksand;
  color: #b1b1b1;
  font-weight: bold;
  font-size: 22px;
  line-height: 30px;
  margin: 0;
  display: block;
  margin-top: 12px;
}
.text {
  display: block;
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: 16px;
  text-align: center;
}
.button {
  margin-bottom: 8px;
  text-transform: uppercase;
}
</style>

<i18n>
{
  "en": {
    "title": "Unsigned user can’t browse any projects",
    "text": "Please create new account or sign in if you already have one",
    "buttonText": "Sign in or Sign up"
  },
  "ru": {
    "title": "Незарегестрированные пользователи не могут просматрить проекты",
    "text": "Создайте новую учетную запись или войдите с имеющейся",
    "buttonText": "Войти или Зарегистрироваться"
  }
}
</i18n>
