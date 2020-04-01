<template>
  <div id="app" :class="showPCStyle ? 'is-pc' : ''">
    <h3>Live password</h3>
    <mt-field
      label="记忆密码"
      placeholder="与个人信息无关的密码"
      type="password"
      v-model.trim="memoryKey"
    />
    <mt-field
      label="区分代号"
      placeholder="taobao、weixin、weibo ..."
      v-model.trim="specialKey"
    />
    <mt-cell title="缓存记忆密码">
      <mt-switch v-model="cacheMemoryKey"></mt-switch>
    </mt-cell>
    <mt-cell title="密码">
      <span>{{ result }}</span>
    </mt-cell>
    <mt-button @click="handleCopy" type="primary" :disabled="!result"
      >点击复制密码</mt-button
    >
  </div>
</template>

<script>
import { Field, Switch, Button, Toast, Cell } from 'mint-ui';
import copy from 'copy-to-clipboard';

export default {
  name: 'app',
  data: () => ({
    memoryKey: '',
    specialKey: '',
    cacheMemoryKey: false,
    showPCStyle: false
  }),
  components: {
    [Field.name]: Field,
    [Switch.name]: Switch,
    [Cell.name]: Cell,
    [Button.name]: Button
  },
  methods: {
    handleCopy() {
      copy(this.result);
      Toast({ message: '复制成功' });
    }
  },
  computed: {
    result({ memoryKey, specialKey }) {
      let shaResult = '';
      if (!memoryKey || !specialKey) return '';
      const str = 'abeklnosuvwxy01279';
      const md5one = window.md5(memoryKey, specialKey);
      const md5two = window.md5(md5one, 'snow');
      const md5three = window.md5(md5one, 'kise');
      const rule = md5three.split('');
      const source = md5two.split('');
      for (let i = 0; i < 32; i++) {
        if (isNaN(source[i])) {
          if (str.search(rule[i]) > -1) {
            source[i] = source[i].toUpperCase();
          }
        }
      }
      const code32 = source.join('');
      const code1 = code32.slice(0, 1);
      shaResult = isNaN(code1)
        ? code32.slice(0, 16)
        : 'K' + code32.slice(1, 16);
      return shaResult;
    }
  },
  watch: {
    cacheMemoryKey: {
      handler(v) {
        window.localStorage.setItem('cacheMemoryKey', String(v));
        if (v) {
          window.localStorage.setItem('memoryKey', this.memoryKey);
        } else {
          window.localStorage.clear();
        }
      }
    },
    memoryKey (v) {
      if (this.cacheMemoryKey) {
        window.localStorage.setItem('memoryKey', v);
      }
    }
  },
  mounted() {
    this.showPCStyle = window.innerWidth > 450;
    this.memoryKey = window.localStorage.getItem('memoryKey')
    this.cacheMemoryKey =
      window.localStorage.getItem('cacheMemoryKey') === 'true';
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
