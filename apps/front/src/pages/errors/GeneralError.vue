<template>
  <div class="not-found-container">
    <h1>申し訳ございません。</h1>
    <p class="message">
      お客様がアクセスしようとしたページが見つかりませんでした。
      <br />
      サイト更新などによってURLが変更になったか、
      <br />
      URLが正しく入力されていない可能性があります。
    </p>
    <button @click="goBackToLogin" class="back-button">Back to Login</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

import { SCREEN_NAMES } from '@/constants';

const router = useRouter();

const goBackToLogin = () => {
  router.push({ name: SCREEN_NAMES.LOGIN });
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  text-align: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.message {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
  color: #555;
}

.back-button {
  padding: 12px 24px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>
