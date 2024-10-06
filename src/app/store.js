import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./screenSharingReducer";

// Cấu hình store mới nhất
export default configureStore({
  reducer: {
    screenSharing: reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // Tắt kiểm tra tính bất biến
      serializableCheck: false, // Tắt kiểm tra tính tuần tự hóa
    }),
});
