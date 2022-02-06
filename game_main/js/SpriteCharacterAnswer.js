phina.define("SpriteCharacterAnswer", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(spritesheet, x, y, width= ANSWER_CHARACTER_WIDTH, height= ANSWER_CHARACTER_HEIGHT) {
    //console.log("SpriteCharacterAnswerクラスinit");
    //console.log("spritesheet", spritesheet);
    this.superInit(spritesheet, "000", x, y, width, height);
  }
});