<template>
  <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4 pt-5">
    <loading :active.sync="isLoading"></loading>
    <h2>Section title</h2>
    <!-- 建立新產品 -->
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">
        建立新產品
      </button>
    </div>

    <!-- 商品列表 -->
    <div class="table-responsive-xl">
      <table class="table mt-4">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="80">編輯</th>
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
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openModal(false, item)"
              >
                編輯
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分頁 -->
    <Pagination @update:pagination="getProducts" :pagination="pagination" />

    <!-- Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">新增產品</h5>
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
                  <label for="customFile">
                    或 上傳圖片
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
                <img class="img-fluid" :src="tempProduct.imageUrl" alt="" />
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
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
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
  </main>
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
          $("#productModal").modal("hide");
          vm.getProducts();
        } else {
          $("#productModal").modal("hide");
          vm.getProducts();
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
        vm.pagination = response.data.pagination; // 分頁
        vm.products = response.data.products; // 產品
      });
    },
    // 開啟 Modal
    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
      $("#productModal").modal("show");
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
      this.axios[httpMethod](api, { data: vm.tempProduct }).then(response => {
        if (response.data.success) {
          $("#productModal").modal("hide");
          vm.getProducts();
        } else {
          $("#productModal").modal("hide");
          vm.getProducts();
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
            this.$bus.$emit("messsage:push", response.data.message, "danger"); // 呼叫 alert
          }
        });
    }
  }
};
</script>

<style></style>
