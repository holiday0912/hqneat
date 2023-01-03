import { post } from "@/http/request";

// 轮播图列表
export const carouselImgList = query => {
  return post("/carouselImg/list", {
    body: { ...query },
    channel: ""
  });
};

// 轮播图新增
export const carouselImgInsert = query => {
  return post("/carouselImg/insert", {
    body: { ...query },
    channel: ""
  });
};

// 轮播图修改
export const carouselImgUpdateVersion = query => {
  return post("/carouselImg/updateVersion", {
    body: { ...query },
    channel: ""
  });
};

// 轮播图审核
export const checkCarouselImg = query => {
  return post("/carouselImg/checkCarouselImg", {
    body: { ...query },
    channel: ""
  });
};

// 轮播图删除
export const carouselImgDeleteVersion = query => {
  return post("/carouselImg/deleteVersion", {
    body: query,
    channel: ""
  });
};
