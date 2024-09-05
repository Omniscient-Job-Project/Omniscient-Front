import { defineStore } from 'pinia';
import axios from 'axios';

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    notice: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchNotice(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/api/`);
        this.notice = response.data;
      } catch (err) {
        this.error = err.response ? err.response.data : err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});