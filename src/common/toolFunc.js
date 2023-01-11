import dayjs from "dayjs";
import { dateFormat } from "@/config/setting";
import { loginResourceList } from "@/api/system/sysUser";
import Big from "big.js";
import bus from "@/components/common/bus";
import router from "@/router";

/**
 * 日期的格式化函数
 * @param target 需要格式化的日期函数
 * @return string
 */
export function day(target) {
  return dayjs(target).format(dateFormat);
}

export async function updateMenuMethod() {
  try {
    const res = await loginResourceList(
      parseFloat(new Big(sessionStorage.getItem("ud")).div(87687))
    );
    if (res.code.slice(-5) === "00000") {
      const temp = res.data.map(i => {
        const inner = {
          icon: i.icon,
          router: i.router,
          resourceName: i.resourceName
        };
        if (i.resources !== null && i.resources?.length !== 0) {
          inner.resources = i.resources.map(o => {
            return {
              icon: o.icon,
              router: o.router,
              resourceName: o.resourceName
            };
          });
        }
        return inner;
      });
      sessionStorage.setItem("userLoginContext", JSON.stringify(temp));
      bus.$emit("updateMenu", temp);
      const temp1 = temp.map(i => {
        if (i.resources) {
          return i.resources.map(i => i.router);
        }
        return i.router;
      });
      const routes = temp1.flat();
      if (!routes.includes(router?.currentRoute.name)) {
        await router.push({ name: "dashboard" });
      }
    }
  } catch (e) {
    throw new Error(e.message);
  }
}
