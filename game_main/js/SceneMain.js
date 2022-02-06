/*
 * メインシーン
 */
phina.define("SceneMain", {
  // 継承
  superClass: "DisplayScene",
  // コンストラクタ
  init: function(param) {
    console.log("SceneMainクラスinit");
    // 親クラス初期化
    this.superInit();
    // セッションID
    this.sessionId = String(document.cookie.match(/PHPSESSID=[A-Za-z0-9]{32}/i)).replace("PHPSESSID=", "");
    // タイトルラベル描画
    this.title;
    // スプライト
    this.sankasyaBosyu;
    this.shutter;
    this.startbutton;
    this.difficulty;
    // スプライトグループ
    this.layer_back_shutter = DisplayElement().addChildTo(this);
    this.layer_shutter = DisplayElement().addChildTo(this);
    this.layer_front_shutter = DisplayElement().addChildTo(this);
    this.score = DisplayElement().addChildTo(this);
    // 同部屋プレイヤー情報の描画
    this.updatePlayerInfo(0);
    // 背景スプライト
    this.mainwindow = Sprite("window").addChildTo(this.layer_shutter);
    this.mainwindow.setPosition(this.gridX.center(), this.gridY.center());
    // シャッター描画
    this.shutter = SpriteShutter(0).addChildTo(this.layer_shutter);
    // Xボタン描画
    this.putXButton();
  },
  // 画面更新
  update: function(app) {
    // プレイヤー更新
    if (app.frame % UPDATE_FRAME == 0) {
      console.log("update_frame：" + app.frame);
      // 同部屋プレイヤー情報の描画
      this.updatePlayerInfo(app.frame);
    };
  },
  // Xボタン描画
  putXButton: function() {
    console.log("SceneMainクラスputXButton");
    this.xbutton = Sprite("xbutton").addChildTo(this);
    this.xbutton.setPosition(SCREEN_WIDTH - BUTTON_SIZE / 2, BUTTON_SIZE / 2);
    //console.log(this.xbutton.x + "/" + this.xbutton.y);
    // Xボタン押下時の処理
    this.xbutton.setInteractive(true);
    this.xbutton.onpointstart = function() {
      this.exit("Exit");
    }.bind(this);
  },
  // タイトル描画
  putTitle: function(theme) {
    console.log("SceneMainクラスputTitle");
    // タイトルラベル
    if (this.title != null) {
      this.title.remove();
    }
    this.title = Label({text: "テーマ： " + theme}).addChildTo(this);
    this.title.setPosition(SCREEN_WIDTH / 2, LABEL_FONT_SIZE);
    this.title.fontSize = LABEL_FONT_SIZE;
    this.title.fill = "white";
    this.title.stroke = "black";
    this.title.strokeWidth = 5;
  },
  // 同部屋プレイヤー情報の更新
  updatePlayerInfo: function(frame) {
    //console.log("SceneMainクラスupdatePlayerInfo");
    axios.post("./apiGetData.php")
    .then(function (response) {
      this.erasePlayers(response);
      this.drawPlayers(response);
    }.bind(this))
    .catch(function (error) { console.log(error); })
    .finally(function () {});
  },
  // プレイヤーオブジェクト描画
  drawPlayers: function(response) {
    //console.log("SceneMainクラスdrawPlayers");
    let keys = Object.keys(response.data);
    // スタートボタン押下前
    if (response.data[this.sessionId].gamestart_flg == 0) {  // 0:スタート前、1:回答前、2:回答済、3:再スタート
      // シャッター制御
      controlShutter(this.shutter, response.data[this.sessionId].currenttimestamp);
      // 難易度画像描画
      if (this.difficulty == null) {
        this.difficulty = SpriteDifficulty(
          DIFFICULTY[document.getElementById("difficulty").innerText].image,
          SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2
        ).addChildTo(this.layer_back_shutter);
      }
      // 参加者募集中
      if (this.sankasyaBosyu == null) {
        this.sankasyaBosyu = SpriteSankasyaBosyu("000", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 + LABEL_FONT_SIZE).addChildTo(this.layer_front_shutter);
        this.sankasyaBosyu.addNameLabel("参加者を待っています", "black");
      }
      for (let array_no = 0; array_no < keys.length; array_no++) {
        // 自プレイヤーの描画
        if (this.sessionId == keys[array_no]) {
          sessionExist = true;
        // 参加メンバの描画
        } else if (this.sessionId != keys[array_no]) {
          // ゲームがスタートしていたらEXIT
          if (response.data[keys[array_no]].gamestart_flg == 1) {  // 0:スタート前、1:回答前、2:回答済、3:再スタート
            this.exit("Exit");
          }
        }
        // スコアの描画
        let score = response.data[keys[array_no]].score;
        let name = response.data[keys[array_no]].name;
        SpriteScore(name, zeroPadding(score, 3), array_no).addChildTo(this.score);
      }
      // スタートボタン描画
      if (this.startbutton == null) {
        this.startbutton = SpriteButtonStart(
          "000", SCREEN_WIDTH / 2, SCREEN_HEIGHT - START_BUTTON_HEIGHT / 2 - PADDING * 2
        ).addChildTo(this.layer_front_shutter);
        // スタートボタン押下時の処理
        this.startbutton.sprite.setInteractive(true);
        this.startbutton.sprite.onpointstart = function() {
          console.log("startButton.onpointstart");

          axios.post("./apiStartGame.php", makeAnswer())
          .then(function (response) {

          }.bind(this))
          .catch(function (error) { console.log(error); })
          .finally(function () {});
        }.bind(this);
      }
    } else if (response.data[this.sessionId].gamestart_flg == 3) {  // 0:スタート前、1:回答前、2:回答済、3:再スタート
      // シャッターを閉じる
      this.shutter.close(0);
      // スコアの描画
      for (let array_no = 0; array_no < keys.length; array_no++) {
        let score = response.data[keys[array_no]].score;
        let name = response.data[keys[array_no]].name;
        SpriteScore(name, zeroPadding(score, 3), array_no).addChildTo(this.score);
        // 回答済みメンバの正解・不正解の描画
        SpriteScoreCorrect(
          response.data[keys[array_no]].top_flg,
          response.data[keys[array_no]].correct,
          response.data[keys[array_no]].answer,
          array_no
        ).addChildTo(this.score);
      }
      // スタートボタン描画
      if (this.startbutton == null) {
        this.startbutton = SpriteButtonStart(
          "000", SCREEN_WIDTH / 2, SCREEN_HEIGHT - START_BUTTON_HEIGHT / 2 - PADDING * 2
        ).addChildTo(this.layer_front_shutter);
        // スタートボタン押下時の処理
        this.startbutton.sprite.setInteractive(true);
        this.startbutton.sprite.onpointstart = function() {
          console.log("startButton.onpointstart");

          axios.post("./apiStartGame.php", makeAnswer())
          .then(function (response) {

          }.bind(this))
          .catch(function (error) { console.log(error); })
          .finally(function () {});
        }.bind(this);
      }
    // スタートボタン押下後、ゲーム開始
    } else {
      this.exit("Game");
    }
  },
  // プレイヤーオブジェクト消去
  erasePlayers: function(response) {
    //console.log("SceneMainクラスerasePlayers");
    this.score.children.length = 0;
  },
});
