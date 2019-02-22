<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <!-- 建立新產品 -->
    <div class="d-flex my-3">
      <h2>Section title</h2>
      <div class="ml-auto">
        <button class="btn btn-primary" @click="openModalEdit(true)">
          建立新產品
        </button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="table-responsive-xl">
      <table class="table mt-4">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th width="240">產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="120">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td class="text-right">{{ item.origin_price | currency }}</td>
            <td class="text-right">{{ item.price | currency }}</td>
            <td>
              <span v-if="item.is_enabled" class="text-success">啟用</span>
              <span v-else>未啟用</span>
            </td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-primary btn-sm"
                  @click="openModalEdit(false, item)"
                >
                  編輯
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="openModalDelete(item)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分頁 -->
    <Pagination @update:pagination="getProducts" :pagination="pagination" />

    <!-- Modal Edit -->
    <div
      class="modal fade"
      id="modal-edit"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-edit-label"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="modal-edit-label">新增產品</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile"
                    >或 上傳圖片
                    <font-awesome-icon
                      icon="spinner"
                      spin
                      v-if="status.fileUploading"
                    />
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadFile"
                  />
                </div>
                <img class="img-fluid" :src="tempProduct.imageUrl" alt />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>
                <hr />
                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled"
                    />
                    <label class="form-check-label" for="is_enabled"
                      >是否啟用</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateProduct"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Delete -->
    <div
      class="modal fade"
      id="modal-delete"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-delete-label"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="modal-delete-label">
              <span>刪除產品</span>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong>
            商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="deletePouduct">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Pagination from "@/components/admin/Pagination";

export default {
  name: "products",
  components: {
    Pagination
  },
  data() {
    return {
      isLoading: false,
      isNew: false,
      pagination: {},
      products: [],
      status: {
        fileUploading: false
      },
      tempProduct: {}
    };
  },
  mounted() {
    this.getProducts();
  },
  methods: {
    // 刪除產品
    deletePouduct(id) {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/admin/product/${id}`;

      vm.axios.delete(api).then(response => {
        if (response.data.success) {
          $("#modal-delete").modal("hide");
          vm.getProducts();
        } else {
          vm.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
        }
      });
    },
    // 取得商品列表
    getProducts(page = 1) {
      const vm = this;
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/products?page=${page}`;

      vm.isLoading = true; // 開始 - 過場動畫
      vm.axios.get(api).then(response => {
        vm.isLoading = false; // 結束 - 過場動畫
        if (response.data.success) {
          vm.pagination = response.data.pagination; // 分頁
          vm.products = response.data.products; // 產品
        } else {
          vm.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
        }
      });
    },
    // 開啟 Modal Delete
    openModalDelete(item) {
      const vm = this;
      $("#modal-delete").modal("show");
      vm.tempProduct = Object.assign({}, item);
    },
    // 開啟 Modal Edit
    openModalEdit(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
      $("#modal-edit").modal("show");
    },
    // 取得商品列表 or 修改產品
    updateProduct() {
      const vm = this;
      let api, httpMethod;

      if (vm.isNew) {
        // 商品建立
        api = `${process.env.VUE_APP_API}/api/${
          process.env.VUE_APP_API_PATH
        }/admin/product`;
        httpMethod = "post";
      } else {
        // 修改產品
        api = `${process.env.VUE_APP_API}/api/${
          process.env.VUE_APP_API_PATH
        }/admin/product/${vm.tempProduct.id}`;
        httpMethod = "put";
      }

      vm.axios[httpMethod](api, { data: vm.tempProduct }).then(response => {
        $("#modal-edit").modal("hide");
        if (response.data.success) {
          vm.getProducts(vm.pagination.current_page);
        } else {
          vm.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
        }
      });
    },
    // 上傳圖片
    uploadFile() {
      const vm = this;
      const formData = new FormData();
      const uploadedFile = this.$refs.files.files[0];
      const api = `${process.env.VUE_APP_API}/api/${
        process.env.VUE_APP_API_PATH
      }/admin/upload`;

      vm.status.fileUploading = true; // 開始 - 圖片上傳小動畫
      formData.append("file-to-upload", uploadedFile);
      this.axios
        .post(api, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          vm.status.fileUploading = false; // 結束 - 圖片上傳小動畫
          if (response.data.success) {
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl);
          } else {
            vm.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
          }
        });
    }
  }
};
</script>

<style></style>
