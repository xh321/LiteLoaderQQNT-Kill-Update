const { BrowserWindow, ipcMain } = require("electron");

function onBrowserWindowCreated(window) {
    const original_send =
        (window.webContents.__qqntim_original_object &&
            window.webContents.__qqntim_original_object.send) ||
        window.webContents.send;

    const patched_send = function (channel, ...args) {
        if (args.length >= 2) {
            //更新 IPC
            if (
                args.some(
                    (item) =>
                        item instanceof Array &&
                        item.length > 0 &&
                        item[0] &&
                        item[0].cmdName != null
                )
            ) {
                var args1 = args[1][0];

                if (args1.cmdName.indexOf("onUnitedConfigUpdate") != -1) {
                    try {
                        var isUpdate = args1.payload?.configData?.content;
                        var realUpdateObj = JSON.parse(isUpdate);

                        var updateVal =
                            realUpdateObj instanceof Array &&
                            realUpdateObj?.some(
                                (item) =>
                                    item &&
                                    item.releaseVersion &&
                                    item.lowestVersion &&
                                    item.jumpUrl
                            );

                        if (updateVal) {
                            args[1][0].payload = [];
                        }
                    } catch {}
                }
            }
        }
        return original_send.call(window.webContents, channel, ...args);
    };
    if (window.webContents.__qqntim_original_object)
        window.webContents.__qqntim_original_object.send = patched_send;
    else window.webContents.send = patched_send;
}

function onLoad(plugin) {}

module.exports = {
    onLoad,
    onBrowserWindowCreated
};
