let app = {
  readyToPlayId: null,
  volume: 0.5,
  track: [
    {
      id: 1,
      //src: "file:///android_asset/www/media/Lost Sky - Where We Started (feat. Jex) [NCS Release].mp3",
      src: './media/Lost Sky - Where We Started (feat. Jex) [NCS Release].mp3',
      title: "Where We Started (feat. Jex)",
      volume: 0.5,
      length: 0,
      artist: "Lost Sky",
      duration: "3:42"
    },
    {
      id: 2,
      //src: "file:///android_asset/www/media/Janji - Heroes Tonight (feat. Johnning) [NCS Release].mp3",
      src: './media/Janji - Heroes Tonight (feat. Johnning) [NCS Release].mp3',
      title: "Heroes Tonight (feat. Johnning)",
      volume: 0.5,
      length: 0,
      artist: "Janji",
      duration: "3:28"
    },
    {
      id: 3,
      //src: "file:///android_asset/www/media/Jim Yosef - Link [NCS Release].mp3",
      src:'./media/Jim Yosef - Link [NCS Release].mp3',
      title: "Link",
      volume: 0.5,
      length: 0,
      artist: "Jim Yosef",
      duration: "3:44"
    },
    {
      id: 4,
      //src: "file:///android_asset/www/media/Lost Sky - Dreams [NCS Release].mp3",
      src:'./media/Lost Sky - Dreams [NCS Release].mp3',
      title: "Dreams",
      volume: 0.5,
      length: 0,
      artist: "Lost Sky",
      duration: "3:35"
    },
    {
      id: 5,
      //src: "file:///android_asset/www/media/Defqwop - Awakening [NCS Release].mp3",
      src:'./media/Defqwop - Awakening [NCS Release].mp3',
      title: "Awakening",
      volume: 0.5,
      length: 0,
      artist: "Defqwop",
      duration: "3:38"
    },
  ],
  media: null,
  status: {
    0: "MEDIA_NONE",
    1: "MEDIA_STARTING",
    2: "MEDIA_RUNNING",
    3: "MEDIA_PAUSED",
    4: "MEDIA_STOPPED",
  },
  err: {
    1: "MEDIA_ERR_ABORTED",
    2: "MEDIA_ERR_NETWORK",
    3: "MEDIA_ERR_DECODE",
    4: "MEDIA_ERR_NONE_SUPPORTED",
  },
  init: function () {
    document.addEventListener("deviceready", app.displayList, false);
  },
  displayList: function () {
    let df = document.createDocumentFragment();
    let homeMain = document.querySelector('.homeMain');
    app.track.forEach((song) => {
      let div = document.createElement('div');
      let img = document.createElement('img');
      let p = document.createElement('p');
      let p1 = document.createElement('p');
      let p2 = document.createElement('p');
      let p3 = document.createElement('p');
      img.src = `./img/${song.id}.png`;
      img.alt = `photo of ${song.title}`;
      div.setAttribute('data-id', song.id);
      p1.textContent = song.title;
      p2.textContent = song.artist;
      p3.textContent = song.duration;
      p.append(p1);
      p.append(p2);
      p.append(p3);
      div.append(img);
      div.append(p);
      df.append(div);
    });
    homeMain.append(df);
    app.ready();
  },
  ready: function () {
    app.addListeners();
  },
  ftw: function () {
    //success creating the media object and playing, stopping, or recording
    console.log("success doing something");
  },
  wtf: function (err) {
    //failure of playback of media object
    console.warn("failure");
    console.error(err);
  },
  statusChange: function (status) {
    console.log("media status is now " + app.status[status]);
    let playbtn = document.getElementById("play-btn");
    let pausebtn = document.getElementById("pause-btn");
    switch (app.status[status]) {
      case "MEDIA_RUNNING":
        app.getCurrentTime();
        break;
        case "MEDIA_PAUSED":
        break;
      case "MEDIA_STOPPED":
        app.autoPlay();
        break;
    }
  },
  addListeners: function () {
    //document.querySelector("#play-btn").addEventListener("click", app.play);
    document.querySelector("#pause-btn").addEventListener("click", app.pause);
    document.querySelector("#up-btn").addEventListener("click", app.volumeUp);
    document
      .querySelector("#down-btn")
      .addEventListener("click", app.volumeDown);
    document.querySelector("#ff-btn").addEventListener("click", app.ff);
    document.querySelector("#rew-btn").addEventListener("click", app.rew);
    document.addEventListener("pause", () => {
      app.media.release();
    });
    // document.addEventListener('menubutton', ()=>{
    //     console.log('clicked the menu button');
    // });
    // document.addEventListener('resume', ()=>{
    //     app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
    // })
    let divs = document.querySelectorAll('[data-id]').forEach((div) => {
      div.addEventListener("click", app.toPlayer);
    })
    document.getElementById("back").addEventListener("click", app.toPlayList);
  },
  removeListeners: function () {
    document.querySelector("#pause-btn").removeEventListener("click", app.pause);
    document.querySelector("#up-btn").removeEventListener("click", app.volumeUp);
    document
      .querySelector("#down-btn")
      .removeEventListener("click", app.volumeDown);
    document.querySelector("#ff-btn").removeEventListener("click", app.ff);
    document.querySelector("#rew-btn").removeEventListener("click", app.rew);
  },
  toPlayer: function (ev) {
    let div = ev.currentTarget;
    let id = parseInt(div.getAttribute('data-id'));
    let home = document.getElementById("home");
    let player = document.getElementById("player");
    let playerTitle = document.querySelector(".playerTitle");
    song = app.track.find((song) => {
      if(song.id === id) return song;
    })
    playerTitle.innerHTML = song.title;
    home.classList.remove("active");
    player.classList.add("active");
    app.readyToPlayId = id;
    console.log(app.readyToPlayId);
    //console.log(playerTitle.innerHTML);
    //console.log(app.readyToPlayId);
    document.querySelector("#play-btn").addEventListener("click", app.playMusic);
    //app.playMusic();
    console.log(app.media);
    //app.removeListeners();
  },
  playMusic: function () {
    if(app.media != null){
      app.media.pause();
    }
    let currentSong = app.track.find((song) => {
      if(song.id === app.readyToPlayId) return song;
    })
    if(app.media != null && app.media.src === currentSong.src ) {
      app.play();
    } else {
      //console.log(currentSong);
      let selectSong = app.track.find(function (obj) {
        if (obj.id === app.readyToPlayId) return obj;
      });
      src = selectSong.src;
      app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
      app.play();
    }
  },
  autoPlay: function () {
    let nextId = app.readyToPlayId + 1;
    if(nextId < 6) {
      let nextSong = app.track.find(function (obj) {
        if (obj.id === nextId) return obj;
      });
      console.log(nextSong);
      src = nextSong.src;
      app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
      app.play();
      let playerTitle = document.querySelector(".playerTitle");
      playerTitle.innerHTML = nextSong.title;
      app.readyToPlayId = nextId;
    }
  },
  toPlayList: function () {
    let home = document.getElementById("home");
    let player = document.getElementById("player");
    player.classList.remove("active");
    home.classList.add("active");
    console.log(app.media);
    //app.pause();
  },
  play: function () {
    app.media.setVolume(app.volume);
    //app.pause();
    app.media.play();
    console.log(app.media);
    let loader = document.querySelector(".container .loader");
    loader.style.animation = "animate 2s linear infinite";
  },
  getCurrentTime: function () {
    let timer = setInterval(function(){
      let duration = app.media._duration;
      //console.log(duration);
      app.media.getCurrentPosition(
        // success callback
        function (position) {
          if (position > -1) {
            //console.log(position + " sec");
            let spanTitle = document.querySelector('.spanTitle');
            let spanPos = document.querySelector('.spanPos');
            let title = app.media.src.split('/')[2].split(' - ')[1].split('[')[0];
            let minDuration = Math.floor(duration / 60);
            let secondDuration = Math.floor(duration % 60);
            let minPosition = Math.floor(position / 60);
            let secondPosition = Math.floor(position % 60);
            spanTitle.innerHTML = `Playing:</br>${title}`;
            spanPos.innerHTML = parseInt(minPosition) + " : " + 
                                secondPosition.toString().padStart(2, '0') + 
                                " / " + 
                                parseInt(minDuration) + " : " + 
                                secondDuration.toString().padStart(2, '0');

            let percentage = (position / duration) * 100;
            let pseudoBar = document.querySelector(":root");
            pseudoBar.style.setProperty("--pseudo-width", `${percentage}%`);
          }
        },
        // error callback
        function (e) {
          console.log("Error getting pos=" + e);
        }
      );
    }, 1000);
  },
  pause: function () {
    app.media.pause();
    let loader = document.querySelector(".container .loader");
    loader.style.animationPlayState = "paused";
  },
  volumeUp: function () {
    let initialVol = app.volume;
    console.log("current volume", initialVol);
    initialVol += 0.1;
    if (initialVol > 1) {
      initialVol = 1.0;
    }
    console.log(initialVol);
    app.volume = initialVol;
    app.media.setVolume(app.volume);
  },
  volumeDown: function () {
    let initialVol = app.volume;
    console.log("current volume", initialVol);
    initialVol -= 0.1;
    if (initialVol < 0) {
      initialVol = 0;
    }
    console.log(initialVol);
    app.volume = initialVol;
    app.media.setVolume(app.volume);
  },
  ff: function () {
    app.media.getCurrentPosition((pos) => {
      let dur = app.media.getDuration();
      console.log("current position", pos);
      console.log("duration", dur);
      pos += 10;
      if (pos < dur) {
        app.media.seekTo(pos * 1000);
      }
    });
  },
  rew: function () {
    app.media.getCurrentPosition((pos) => {
      pos -= 10;
      if (pos > 0) {
        app.media.seekTo(pos * 1000);
      } else {
        app.media.seekTo(0);
      }
    });
  },
};

app.init();
