const settings = (queue) => {
    const loop = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : (queue.repeatMode === 1 ? 'Single' : (queue.repeatMode === 3 ? 'Autoplay' : 'Off' ))) : 'Off';
    const volume = queue.node.volume;
    const track = queue.currentTrack;
    const author = track.author;
    const timestamp = queue.node.getTimestamp();
    const trackDuration = timestamp.progress == 'Forever' ? 'สตรีมแบบสด' : track.duration;

    return `ศิลปิน : **${author}**\n`
        + `เวลา : \`${trackDuration}\` | เสียง: \`${volume}%\` | วนซ้ำ: \`${loop}\``;
};

module.exports.settings = settings;