// 轮播图审核状态的枚举
export const carouStatus = [
  {
    key: "0",
    val: "待审核"
  },
  {
    key: "1",
    val: "审核未通过"
  },
  {
    key: "2",
    val: "审核通过"
  }
];

// 提示配置的状态枚举
// 4审核通过 0审核中 1复核生效 2复核拒绝 3删除审核中
export const ToastStatus = [
  {
    key: "0",
    val: "审核中"
  },
  {
    key: "1",
    val: "复核生效"
  },
  {
    key: "2",
    val: "复核拒绝"
  },
  {
    key: "3",
    val: "删除审核中"
  },
  {
    key: "4",
    val: "审核通过"
  }
];

// 业务员类型的枚举
export const serviceType = [
  {
    key: "regular",
    val: "定期"
  },
  {
    key: "fund",
    val: "基金"
  },
  {
    key: "loan",
    val: "贷款"
  }
];

/**
 * 导航栏菜单 0 停用 1 启用
 */
export const tabBarStatus = [
  {
    key: "0",
    val: "停用"
  },
  {
    key: "1",
    val: "启用"
  }
];