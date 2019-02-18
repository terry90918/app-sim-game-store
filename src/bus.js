import Vue from "vue";

Vue.prototype.$bus = new Vue();

/**
 * Alert Message
 * messsage:push
 * message(String): default = 提示訊息
 * status(String): default = warning, Bootstrap4 Aler Style
 */
