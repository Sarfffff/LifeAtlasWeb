(function () {
  var wasPlaying = {
    audio: new WeakSet(),
    video: new WeakSet(),
    aplayers: new WeakSet()
  };

  function getAplayers() {
    return Array.isArray(window.aplayers) ? window.aplayers : [];
  }

  function pauseHtmlMedia() {
    document.querySelectorAll("audio, video").forEach(function (media) {
      if (!media.paused && !media.ended) {
        if (media.tagName === "AUDIO") wasPlaying.audio.add(media);
        if (media.tagName === "VIDEO") wasPlaying.video.add(media);
        media.pause();
      }
    });
  }

  function resumeHtmlMedia() {
    document.querySelectorAll("audio, video").forEach(function (media) {
      var shouldResume =
        (media.tagName === "AUDIO" && wasPlaying.audio.has(media)) ||
        (media.tagName === "VIDEO" && wasPlaying.video.has(media));

      if (shouldResume) {
        media.play().catch(function () {});
      }
    });
  }

  function pauseAplayers() {
    getAplayers().forEach(function (player) {
      if (player && player.audio && !player.audio.paused) {
        wasPlaying.aplayers.add(player);
        player.pause();
      }
    });
  }

  function resumeAplayers() {
    getAplayers().forEach(function (player) {
      if (player && wasPlaying.aplayers.has(player)) {
        try {
          player.play();
        } catch (error) {}
      }
    });
  }

  function handleVisibility() {
    if (document.hidden) {
      pauseHtmlMedia();
      pauseAplayers();
    } else {
      resumeHtmlMedia();
      resumeAplayers();
    }
  }

  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("pagehide", function () {
    pauseHtmlMedia();
    pauseAplayers();
  });
})();
