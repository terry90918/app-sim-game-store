<template>
  <div>
    <footer class="bg-light text-muted py-5">
      <div class="container">
        <ul class="list-inline text-center">
          <li class="list-inline-item">© Copright 2019 Sim Games Sotre</li>
          <li class="list-inline-item">
            <a class="text-info" href="#">
              <font-awesome-icon :icon="['fab', 'instagram']" />
              Instagrame
            </a>
          </li>
          <li class="list-inline-item">
            <a class="text-info" href="#">
              <font-awesome-icon :icon="['fab', 'facebook-square']" />
              Facebook
            </a>
          </li>
          <li class="list-inline-item">
            <a class="text-info" href="#">About</a>
          </li>
        </ul>
        <p class="text-center">Made with Bootstrap4</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "footer-bar"
};
</script>

<style></style>
