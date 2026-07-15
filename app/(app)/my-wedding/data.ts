import type { WeddingData } from "./types";

export const weddingData: WeddingData = {
  couple: {
    groom: {
      name: "Võ Hải Nam",
      role: "Trưởng Nam",
    },
    bride: {
      name: "Huỳnh Khánh Linh",
      role: "Út Nữ",
    },
    combined: "Hải Nam & Khánh Linh",
  },
  parents: {
    groom: {
      side: "Nhà Trai",
      father: "Ông Võ Thành Trung",
      mother: "Bà Nguyễn Thị Hạnh",
      address: "142 Đường Trần Hưng Đạo, Phường Cẩm Phô, TP. Hội An, Quảng Nam",
    },
    bride: {
      side: "Nhà Gái",
      father: "Ông Huỳnh Minh Đức",
      mother: "Bà Lê Thị Ngọc Ánh",
      address: "27 Đường Nguyễn Huệ, Phường Vĩnh Ninh, TP. Huế, Thừa Thiên Huế",
    },
  },
  cover: {
    date: "30 . 07 . 2026",
    invite: "Trân trọng kính mời",
  },
  event: {
    datetime: "2026-07-30T18:00:00+07:00",
    timeLabel: "18:00, Thứ Năm",
    dateBlock: {
      weekday: "Thứ Năm",
      day: "30",
      month: "07",
      year: "2026",
      lunar: "Nhằm ngày 17 tháng 6 năm Bính Ngọ",
    },
    ceremonyVenue: "Tư gia nhà trai, 142 Trần Hưng Đạo, Hội An",
  },
  reception: {
    venueName: "Gala Center",
    address: "88 Đường Võ Nguyên Giáp, Phường Ngũ Hành Sơn, TP. Đà Nẵng",
    mapQuery: "Gala Center 88 Vo Nguyen Giap Da Nang",
  },
  hero: {
    src: "/wedding/gallery-3.jpg",
    alt: "Cô dâu và chú rể cười rạng rỡ trong buổi chụp ảnh cưới ngoại cảnh",
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
      src: "/wedding/gallery-1.jpg",
      alt: "Cô dâu chú rể nắm tay nhau dạo bước trên bãi biển lúc hoàng hôn",
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
