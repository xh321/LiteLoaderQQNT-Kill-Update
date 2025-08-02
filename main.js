function onBrowserWindowCreated(window) {
    const original_send =
        (window.webContents.__qqntim_original_object &&
            window.webContents.__qqntim_original_object.send) ||
        window.webContents.send;

    const patched_send = function (channel, ...args) {
        if (args.length >= 2) {
            // 遍历 args 查找包含 onUnitedConfigUpdate 的 cmdName
            var targetArg = args.find(arg =>
                arg &&
                arg.cmdName &&
                arg.cmdName.indexOf("onUnitedConfigUpdate") != -1
            );

            if (targetArg) {

                try {
                    var configData = targetArg.payload?.configData;
                    if (configData && configData.content) {
                        var realUpdateObj = JSON.parse(configData.content);

                        var updateVal = realUpdateObj instanceof Array &&
                            realUpdateObj.some(item =>
                                item &&
                                item.releaseVersion &&
                                item.lowestVersion &&
                                item.jumpUrl
                            );

                        if (updateVal) {
                            console.log("[Kill Update]: Find Update Package, kill it")
                            targetArg.payload.configData.content = "[]";
                        }
                    }
                } catch (e) {
                    console.log("[Kill Update]: Error occured", e);
                }
            }
        }
        return original_send.call(window.webContents, channel, ...args);
    };
    if (window.webContents.__qqntim_original_object)
        window.webContents.__qqntim_original_object.send = patched_send;
    else window.webContents.send = patched_send;
}

function onLoad(plugin) { }

module.exports = {
    onLoad,
    onBrowserWindowCreated
};
