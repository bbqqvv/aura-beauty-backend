require('dotenv').config();
const connectDB = require('./config/db');
const Store = require('./model/Store');

const storesData = [
  {
    name: "Aura Flagship Store Quận 1",
    region: "hcm",
    regionLabel: "TP. Hồ Chí Minh",
    address: "88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    phone: "028.3822.8888",
    hours: "08:30 - 22:00 (Hàng ngày)",
    mapUrl: "https://maps.google.com/?q=88+Đồng+Khởi+Quận+1+TP+Hồ+Chí+Minh",
    features: ["Đại lộ mua sắm", "Spa chăm sóc da", "Chỗ đậu xe hơi", "Thử son miễn phí"],
    status: "active"
  },
  {
    name: "Aura Beauty Thảo Điền",
    region: "hcm",
    regionLabel: "TP. Hồ Chí Minh",
    address: "45 Thảo Điền, Phường Thảo Điền, Quận 2 (Thủ Đức), TP. Hồ Chí Minh",
    phone: "028.3744.9999",
    hours: "09:00 - 21:30 (Hàng ngày)",
    mapUrl: "https://maps.google.com/?q=45+Thảo+Điền+Quận+2+TP+Hồ+Chí+Minh",
    features: ["Không gian xanh", "Tư vấn chuyên sâu", "Khu trải nghiệm sản phẩm"],
    status: "active"
  },
  {
    name: "Aura Beauty Hoàn Kiếm",
    region: "hanoi",
    regionLabel: "Hà Nội",
    address: "12 Hàng Khay, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội",
    phone: "024.3938.6666",
    hours: "08:30 - 22:00 (Hàng ngày)",
    mapUrl: "https://maps.google.com/?q=12+Hàng+Khay+Hoàn+Kiếm+Hà+Nội",
    features: ["Trung tâm phố cổ", "Trang điểm cá nhân", "Đầy đủ mẫu thử"],
    status: "active"
  },
  {
    name: "Aura Beauty Cầu Giấy",
    region: "hanoi",
    regionLabel: "Hà Nội",
    address: "215 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
    phone: "024.3767.5555",
    hours: "09:00 - 21:30 (Hàng ngày)",
    mapUrl: "https://maps.google.com/?q=215+Cầu+Giấy+Cầu+Giấy+Hà+Nội",
    features: ["Khu vực đỗ xe rộng", "Quà tặng check-in", "Soi da miễn phí"],
    status: "active"
  },
  {
    name: "Aura Beauty Hải Châu",
    region: "danang",
    regionLabel: "Đà Nẵng",
    address: "104 Lê Duẩn, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng",
    phone: "0236.3888.777",
    hours: "08:30 - 21:30 (Hàng ngày)",
    mapUrl: "https://maps.google.com/?q=104+Lê+Duẩn+Hải+Châu+Đà+Nẵng",
    features: ["Mặt tiền rộng", "Chăm sóc da cơ bản", "Ưu đãi khách VIP"],
    status: "active"
  }
];

const seedStores = async () => {
  try {
    await connectDB();
    await Store.deleteMany({});
    const createdStores = await Store.insertMany(storesData);
    console.log(`Successfully seeded ${createdStores.length} stores!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding stores:", error);
    process.exit(1);
  }
};

seedStores();
