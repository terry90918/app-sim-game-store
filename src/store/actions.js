export default {
  // 更新讀取效果
  updateLoading(context, payload) {
    context.commit("LOADING", payload);
  }
};
