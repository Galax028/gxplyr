const mm = require("music-metadata");

const args = process.argv.slice(2);
switch (args[0]) {
    case "parse":
        (async () => {
            try {
                let data = await mm.parseFile(args[1], {
                    duration: true,
                    skipCovers: true,
                });
                console.log(
                    JSON.stringify({
                        filename: args[1].split("\\").pop().split("/").pop(),
                        duration: Math.round(data.format.duration),
                        title: data.common.title,
                        author: data.common.artist,
                    })
                );
            } catch (err) {
                throw err;
            }
        })();
        break;
    default:
        console.error("invalid action supplied");
}
