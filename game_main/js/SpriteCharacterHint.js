phina.define("SpriteCharacterHint", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(spritesheet, animation, x, y, width= HINT_CHARACTER_WIDTH, height= HINT_CHARACTER_HEIGHT) {
    //console.log("SpriteCharacterHintクラスinit");
    this.superInit(spritesheet, animation, x, y, width, height);
    // 初期位置
    this.sprite.x = x;
    this.sprite.y = y;
  }
});