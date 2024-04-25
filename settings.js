var settings = {
    load: function (appName) {
        var path = io.buildPath(shell.specialFolders("AppData"), appName + ".json");
        return JSON.parse(ios.load(path));
    },
    save: function (appName, data) {
        var path = io.buildPath(shell.specialFolders("AppData"), appName + ".json");
        return ios.save(path, JSON.stringify(data));
    }
}