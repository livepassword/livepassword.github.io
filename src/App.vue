<template>
  <div id="app" :class="showPCStyle ? 'is-pc' : ''">
    <h3>Live password</h3>
    <mt-field label="记忆密码" placeholder="与个人信息无关的密码" type="password" v-model="memoryKey"></mt-field>
    <mt-field label="区分代号" placeholder="taobao、weixin、weibo ..." v-model="specialKey"></mt-field>
    <mt-field label="密码位数" placeholder="10~40" v-model="passwdNum"></mt-field>
    <mt-field label="包含大小写">
      <mt-switch v-model="isContainUpper"></mt-switch>
    </mt-field>
    <mt-field label="包含特殊字符">
      <mt-switch v-model="isContainSpecial"></mt-switch>
    </mt-field>
    <mt-field label="密码">
      <span>{{ result }}</span>
    </mt-field>
    <mt-button @click="handleCopy" type="primary" :disabled="!result">
      点击复制密码
    </mt-button>
  </div>
</template>

<script>
import sha from 'js-sha256';
import { Field, Switch, Button, Toast } from 'mint-ui';
import copy from 'copy-to-clipboard';

const START_NUM = 5;
const SPECIAL_CODE = ',';

export default {
  name: 'app',
  data: () => ({
    memoryKey: '',
    specialKey: '',
    isContainUpper: false,
    isContainSpecial: false,
    passwdNum: '16',
    showPCStyle: false
  }),
  components: {
    [Field.name]: Field,
    [Switch.name]: Switch,
    [Button.name]: Button
  },
  methods: {
    replaceString(str, pos, target) {
      return str.substring(0, pos - 1) + target + str.substring(pos);
    },
    handleCopy() {
      copy(this.result);
      Toast({ message: '复制成功' });
    }
  },
  computed: {
    result({
      memoryKey,
      specialKey,
      isContainUpper,
      isContainSpecial,
      passwdNum
    }) {
      if (!memoryKey || !specialKey) return '';
      let shaResult = sha(sha(memoryKey) + sha(specialKey));
      passwdNum = parseInt(passwdNum, 10)
      if (passwdNum < 10) passwdNum = 10
      if (passwdNum > 40) passwdNum = 40
      if (!passwdNum || isNaN(passwdNum)) passwdNum = 16
      shaResult = shaResult.slice(START_NUM, +passwdNum + START_NUM);
      if (isContainUpper) {
        let i = 0;
        shaResult = shaResult
          .split('')
          .map(word => {
            if (word > 'a' && word < 'z') {
              i++;
              if (i % 2) word = word.toUpperCase();
            }
            return word;
          })
          .join('');
        if (i === 0) shaResult = shaResult.slice(2) + 'Az';
      }
      if (isContainSpecial) {
        const middle = Math.floor(shaResult.length / 2);
        shaResult = this.replaceString(shaResult, middle, SPECIAL_CODE);
      }
      return shaResult;
    }
  },
  mounted() {
    this.showPCStyle = window.innerWidth > 450
  }
};
</script>

<style lang="less">
#app {
  &.is-pc {
    width: 450px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 2px #ccc;
    padding-bottom: 30px;
    margin: 30px auto;
  }
  h3 {
    text-align: center;
  }
  .mint-button {
    margin: 10px auto;
    display: block;
  }
}
</style>
