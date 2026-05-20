const mongoose = require("mongoose");

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Vui lòng cung cấp tên cửa hàng/chi nhánh"],
    maxLength: 150,
  },
  region: {
    type: String,
    trim: true,
    required: [true, "Vui lòng cung cấp mã khu vực (ví dụ: hcm, hanoi)"],
    lowercase: true,
  },
  regionLabel: {
    type: String,
    trim: true,
    required: [true, "Vui lòng cung cấp tên hiển thị khu vực (ví dụ: Hà Nội)"],
  },
  address: {
    type: String,
    trim: true,
    required: [true, "Vui lòng cung cấp địa chỉ cửa hàng"],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Vui lòng cung cấp số điện thoại chi nhánh"],
  },
  hours: {
    type: String,
    trim: true,
    default: "08:30 - 22:00 (Hàng ngày)",
  },
  mapUrl: {
    type: String,
    trim: true,
    required: [true, "Vui lòng cung cấp link bản đồ chỉ đường Google Maps"],
  },
  features: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
}, {
  timestamps: true,
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
