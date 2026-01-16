import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default {
  install(app) {
    app.use(Toast, {
      timeout: 5000, 
      position: "top-right",
      closeOnClick: true,
      pauseOnHover: true,
    });
  },
};