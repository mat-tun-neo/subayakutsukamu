phina.define("SpriteScoreCorrect", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(top_flg, correct_char_no, answer_char_no, locate, width= SCORE_WIDTH, height= SCORE_HEIGHT) {
    //console.log("SpriteScoreCorrectCorrectクラスinit");
    let label = "";
    let spritesheet = CHARACTER_NO[zeroPadding(answer_char_no, 3)].spritesheet;
    //console.log("spritesheet", spritesheet);
    let animation = CHARACTER_NO[zeroPadding(answer_char_no, 3)].correct;
    if (top_flg == "1") label = "+1";
    if (correct_char_no != answer_char_no) {
      animation = CHARACTER_NO[zeroPadding(answer_char_no, 3)].wrong;
      label = "-1";
    }
    this.superInit(spritesheet, animation, 0, 0, width, height);
    this.drawCards(locate, width, height);
    this.addLabel(label);
  },
  drawCards: function(locate, width, height) {
    // 表示位置（0）
    if (locate == 0) {
      this.sprite.x = 240;
      this.sprite.y = 120 + LABEL_FONT_SIZE*2;
    }
    // 表示位置（1）
    if (locate == 1) {
      this.sprite.x = 400;
      this.sprite.y = 120 + LABEL_FONT_SIZE*2;
    }
    // 表示位置（2）
    if (locate == 2) {
      this.sprite.x = 80;
      this.sprite.y = 170 + LABEL_FONT_SIZE*2;
    }
    // 表示位置（3）
    if (locate == 3) {
      this.sprite.x = 560;
      this.sprite.y = 170 + LABEL_FONT_SIZE*2;
    }
  },
  // ラベル追加
  addLabel: function(str="", color="white") {
    this.nameLabel = Label({
      text: str,
      x: this.sprite.x,
      y: this.sprite.y - LABEL_FONT_SIZE*2,
      fontSize: LABEL_FONT_SIZE * 2,
      fill: color,
      stroke: "yellow",
      strokeWidth: 8,
    }).addChildTo(this);
  }
});