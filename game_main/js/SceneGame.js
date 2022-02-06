/*
 * メインシーン
 */
phina.define("SceneGame", {
  // 継承
  superClass: "DisplayScene",
  // コンストラクタ
  init: function(param) {
    console.log("SceneGameクラスinit");
    // 親クラス初期化
    this.superInit();
    // セッションID
    this.sessionId = String(document.cookie.match(/PHPSESSID=[A-Za-z0-9]{32}/i)).replace("PHPSESSID=", "");
    // タイトルラベル描画
    this.title;
    // スプライト
    this.shutter;
    this.hint_sprite1;
    this.hint_sprite2;
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
    // 回答用のキャラクター描画
    for (let char_no = 0; char_no < Object.keys(CHARACTER_NO).length; char_no++) {
      let x = char_no * ANSWER_CHARACTER_WIDTH + ANSWER_CHARACTER_WIDTH/2;
      let y = SCREEN_HEIGHT - ANSWER_CHARACTER_HEIGHT + PADDING * 3;
      let spritesheet = CHARACTER_NO[zeroPadding(char_no, 3)].spritesheet;
      console.log("spritesheet,char_no", spritesheet, char_no);
      let character = SpriteCharacterAnswer(spritesheet, x, y).addChildTo(this.layer_front_shutter);
      // 回答押下時の処理
      character.sprite.setInteractive(true);
      character.sprite.onpointstart = function() {
        console.log("pushed character", zeroPadding(char_no, 3));
        let post_data = { "answer": zeroPadding(char_no, 3) };
        axios.post("./apiPushAnswer.php", post_data)
        .then(function (response) {

        }.bind(this))
        .catch(function (error) { console.log(error); })
        .finally(function () {});
      }.bind(this);
    }
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
    console.log("SceneGameクラスputXButton");
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
    console.log("SceneGameクラスputTitle");
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
    //console.log("SceneGameクラスupdatePlayerInfo");
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
    //console.log("SceneGameクラスdrawPlayers");
    let keys = Object.keys(response.data);
    // シャッター制御
    controlShutter(this.shutter, response.data[this.sessionId].currenttimestamp);
    // スコアの描画
    for (let array_no = 0; array_no < keys.length; array_no++) {
      let score = response.data[keys[array_no]].score;
      let name = response.data[keys[array_no]].name;
      SpriteScore(name, zeroPadding(score, 3), array_no).addChildTo(this.score);
      // 回答済みメンバの正解・不正解の描画
      if (response.data[keys[array_no]].gamestart_flg >= 2) {
        SpriteScoreCorrect(
          response.data[keys[array_no]].top_flg,
          response.data[keys[array_no]].correct,
          response.data[keys[array_no]].answer,
          array_no
        ).addChildTo(this.score);
      }
    }
    // ヒント画像の描画
    for (let i=1; i<3; i++) {
      let hint = response.data[this.sessionId]["hint" + i];
      SpriteCharacterHint(
        hint.spritesheet,
        hint.animations,
        SCREEN_WIDTH/2 + hint.x,
        SCREEN_HEIGHT/2 + hint.y,
        HINT_CHARACTER_WIDTH * hint.size,
        HINT_CHARACTER_HEIGHT * hint.size,
      ).addChildTo(this.layer_back_shutter);
    }
    // 全員が回答したら、設定時間経過後にMainへ戻る
    let main_flg = true;
    for (let array_no = 0; array_no < keys.length; array_no++) {
      if (response.data[keys[array_no]].gamestart_flg != 3) {  // 0:スタート前、1:回答前、2:回答済、3:再スタート
        main_flg = false;
      }
    }
    let now = Math.floor(Date.now());
    // console.log("now", now);
    // console.log("response.data[this.sessionId].all_answertime", response.data[this.sessionId].all_answertime);
    // console.log("now - response.data[this.sessionId].all_answertime", now - response.data[this.sessionId].all_answertime);
    if (main_flg && now - response.data[this.sessionId].all_answertime > TIME_TO_NEXTGAME) {
      this.exit("Main");
    }
  },
  // プレイヤーオブジェクト消去
  erasePlayers: function(response) {
    //console.log("SceneGameクラスerasePlayers");
    this.layer_back_shutter.children.length = 0;
    this.score.children.length = 0;
  },
});
