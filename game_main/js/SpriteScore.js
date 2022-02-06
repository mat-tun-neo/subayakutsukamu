phina.define("SpriteScore", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(name, animation, locate, width= SCORE_WIDTH, height= SCORE_HEIGHT) {
    //console.log("SpriteScoreクラスinit");
    this.superInit("score", animation, 0, 0, width, height);
    this.drawCards(locate, width, height);
    this.addNameLabel(name);
  },
  drawCards: function(locate, width, height) {
    // 表示位置（0）
    if (locate == 0) {
      this.sprite.x = 240;
      this.sprite.y = 120;
    }
    // 表示位置（1）
    if (locate == 1) {
      this.sprite.x = 400;
      this.sprite.y = 120;
    }
    // 表示位置（2）
    if (locate == 2) {
      this.sprite.x = 80;
      this.sprite.y = 170;
    }
    // 表示位置（3）
    if (locate == 3) {
      this.sprite.x = 560;
      this.sprite.y = 170;
    }
  },
  // 名前ラベル追加
  addNameLabel: function(str="", color="white") {
    this.nameLabel = Label({
      text: str,
      x: this.sprite.x,
      y: this.sprite.y - SCORE_HEIGHT + LABEL_FONT_SIZE,
      fontSize: LABEL_FONT_SIZE * 0.8,
      fill: color,
      stroke: "black",
      strokeWidth: 6,
    }).addChildTo(this);
  }
});