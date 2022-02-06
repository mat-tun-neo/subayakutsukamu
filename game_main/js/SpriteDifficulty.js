phina.define("SpriteDifficulty", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(animation, x, y, width= HINT_CHARACTER_WIDTH, height= HINT_CHARACTER_HEIGHT) {
    //console.log("SpriteDifficultyクラスinit");
    this.superInit("difficulty", animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  },
  // 名前ラベル追加
  addNameLabel: function(str="", color="white") {
    this.nameLabel = Label({
      text: str,
      x: this.sprite.x,
      y: this.sprite.y,
      fontSize: LABEL_FONT_SIZE,
      fill: color,
      stroke: "red",
      strokeWidth: 6,
    }).addChildTo(this);
  }
});