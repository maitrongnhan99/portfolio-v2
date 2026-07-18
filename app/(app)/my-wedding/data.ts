import type { WeddingData } from "./types";

export const weddingData: WeddingData = {
  couple: {
    groom: {
      name: "Mai Trọng Nhân",
      role: "Trưởng Nam",
    },
    bride: {
      name: "Trương Ngọc Yến Linh",
      role: "Trưởng Nữ",
    },
    combined: "Trọng Nhân & Yến Linh",
  },
  parents: {
    groom: {
      side: "Nhà Trai",
      father: "Mai Thanh Phong",
      mother: "Lê Ngọc Bích Thuỷ",
      address: "Ấp Bình Linh, xã Mỹ Hiệp, tỉnh Đồng Tháp",
    },
    bride: {
      side: "Nhà Gái",
      mother: "Nguyễn Thị Trúc Hương",
      address: "Ấp 03, xã Mỹ Hiệp, tỉnh Đồng Tháp",
    },
  },
  cover: {
    date: "28 tháng 7, 2026",
    invite: "Trân trọng kính mời",
  },
  event: {
    datetime: "2026-07-28T09:00:00+07:00",
    timeLabel: "09:00, Thứ Ba",
    ceremonyTime: "09:00",
    dateBlock: {
      weekday: "Thứ Ba",
      day: "28",
      month: "07",
      year: "2026",
      lunar: "Nhằm ngày 15 tháng 6 năm Bính Ngọ",
    },
    ceremonyVenue: "Tư Gia",
  },
  reception: {
    venueName: "Gala Center",
    address: "415 Hoàng Văn Thụ, Phường 2, Tân Bình, Hồ Chí Minh",
    mapQuery: "Gala Center 415 Hoang Van Thu Tan Binh Ho Chi Minh",
  },
  hero: {
    src: "/wedding/hero.jpg",
    alt: "Cô dâu và chú rể bên nhau trên bậc thang đá giữa vườn hoa giấy trắng",
  },
  portraits: {
    groom: {
      src: "/wedding/groom.jpg",
      alt: "Chân dung chú rể Võ Hải Nam trong vest cưới",
    },
    bride: {
      src: "/wedding/bride.jpg",
      alt: "Chân dung cô dâu Huỳnh Khánh Linh trong váy cưới",
    },
  },
  gallery: [
    {
      src: "/wedding/gallery-1-v2.jpg",
      alt: "Cô dâu chú rể nắm tay nhau dạo bước trên thảm cỏ xanh trước bậc thềm đá",
      wide: true,
    },
    {
      src: "/wedding/gallery-2.jpg",
      alt: "Cô dâu chú rể cười đùa bên nhau trong khu vườn hoa",
    },
    {
      src: "/wedding/gallery-3.jpg",
      alt: "Cô dâu và chú rể cười rạng rỡ trong buổi chụp ảnh cưới ngoại cảnh",
    },
    {
      src: "/wedding/gallery-4.jpg",
      alt: "Chú rể ôm cô dâu giữa hàng cây phố cổ Hội An",
    },
    {
      src: "/wedding/gallery-5.jpg",
      alt: "Cô dâu chú rể trao nhau ánh nhìn âu yếm dưới ánh nắng chiều",
    },
    {
      src: "/wedding/gallery-6.jpg",
      alt: "Cận cảnh nhẫn cưới và đôi tay cô dâu chú rể",
    },
    {
      src: "/wedding/gallery-7.png",
      alt: "Cô dâu chú rể đeo kính râm tạo dáng bên tháp ly champagne trong tiệc cưới sang trọng",
    },
  ],
  dressCode: {
    note: "Thân mời quý khách đồng hành cùng gam màu chủ đạo của buổi tiệc",
    swatches: ["#3E5C3A", "#F3EFE4", "#D8CBB0"],
  },
  timeline: [
    { time: "17:30", label: "Đón khách" },
    { time: "18:30", label: "Khai tiệc" },
    { time: "18:45", label: "Rót rượu, cắt bánh" },
    { time: "19:00", label: "Phục vụ món chính" },
    { time: "21:00", label: "Kết thúc tiệc" },
  ],
  gift: {
    note: "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!",
    groom: {
      bank: "Techcombank",
      bankCode: "TCB",
      accountNumber: "1903 6621 5390 14",
      accountName: "MAI TRONG NHAN",
      qrImage: "/wedding/qr-groom.png",
    },
    bride: {
      bank: "Techcombank",
      bankCode: "TCB",
      accountNumber: "1903 6560 8440 13",
      accountName: "TRUONG NGOC YEN LINH",
      qrImage: "/wedding/qr-bride.png",
    },
  },
  wishes: [
    {
      id: "wish-001",
      name: "Trần Minh Quân",
      message:
        "Chúc hai bạn trăm năm hạnh phúc, mãi mãi yêu thương và đồng hành cùng nhau trên mọi chặng đường!",
      avatar: "/wedding/gallery-2.jpg",
      createdAt: "2026-06-01T09:15:00+07:00",
    },
    {
      id: "wish-002",
      name: "Phạm Thảo Vy",
      message:
        "Chúc mừng đám cưới của Nam và Linh! Mong hai bạn luôn tràn đầy tiếng cười và hạnh phúc bên nhau.",
      avatar: "/wedding/gallery-4.jpg",
      createdAt: "2026-06-03T14:30:00+07:00",
    },
    {
      id: "wish-003",
      name: "Nguyễn Bảo Ngọc",
      message:
        "Chúc cô dâu chú rể sớm sinh quý tử, gia đình luôn ấm êm và hạnh phúc viên mãn nhé!",
      avatar: "/wedding/gallery-5.jpg",
      createdAt: "2026-06-10T20:45:00+07:00",
    },
    {
      id: "wish-004",
      name: "Lê Đăng Khoa",
      message:
        "Chúc hai bạn một đám cưới thật đẹp và một cuộc sống hôn nhân ngập tràn yêu thương!",
      avatar: "/wedding/gallery-6.jpg",
      createdAt: "2026-06-15T11:00:00+07:00",
    },
  ],
};
