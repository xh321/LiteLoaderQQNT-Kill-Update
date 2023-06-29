export function onLoad() {
    const interval = setInterval(() => {
        const update_btn = document.querySelector("body > div.q-dialog > div.update-dialog.q-dialog-main > div.q-dialog-footer > div > button.q-button.q-button--primary.q-button--default > span");
        if (update_btn) {
            clearInterval(interval);

            if(update_btn.textContent == "立即更新"){
                console.log("[Kill-Update]","发现更新弹窗，关闭")

                document.querySelector("body > div.q-dialog > div.update-dialog.q-dialog-main > div.q-dialog-header > i").click()
            }
        }
    }, 100);

    //半分钟后还不弹窗，应该不会弹了，取消上面的定时器
    setInterval(()=>{
        clearInterval(interval);
    },30000)
}
