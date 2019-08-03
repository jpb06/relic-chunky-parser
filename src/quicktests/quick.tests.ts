import { RelicChunkyParser } from "..";

let yolo = async () => {
    try {
        let r = await RelicChunkyParser.getReplayData(
            'D:\\SteamGames\\steamapps\\common\\Dawn of War Soulstorm\\Playback\\' +
            //'Antiga Bay (2) v10.2019-07-06.15-51-23.rec'
            'Sands of Time (2) v10_06292019-091533.rec'
        );
        if (r === undefined) {
            console.log('Result is undefined');
        } else {
            console.log('modname', r.modName);
        }

        let b = 0;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
yolo();