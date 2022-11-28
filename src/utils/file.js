/**
 * @Description 文件流下载
 * @Author ai_xinxin
 * @Date 2021/03/08 16:16
 * @fileName 文件名
 * @type 文件类型
 * @data 文件流
 */
export function upLoadFile(fileName,type,data) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(data, fileName);
    } else {
        let blob = new Blob([data], {type: `application/${type};charset=utf-8`});
        // 获取heads中的filename文件名
        let downloadElement = document.createElement('a');
        // 创建下载的链接
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        // 下载后文件名
        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        // 点击下载
        downloadElement.click();
        // 下载完成移除元素
        document.body.removeChild(downloadElement);
        // 释放掉blob对象
        window.URL.revokeObjectURL(href);
    }
}